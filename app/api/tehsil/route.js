import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Tehsil from "../../../lib/models/tehsil";
import { revalidateTag } from "next/cache";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const state_slug = searchParams.get("state_slug");
    const district_slug = searchParams.get("district_slug");
    const tehsil_slug = searchParams.get("block_slug");

    // Case 1: Both state_slug AND district_slug provided → return single district details
    if (state_slug && district_slug && tehsil_slug) {
      const tehsil = await Tehsil.findOne({
        state_slug,
        district_slug,
        tehsil_slug,
      }).lean();

      if (!tehsil) {
        return NextResponse.json(
          { error: "Tehsil not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(tehsil, { status: 200 });
    }

    // Case 2b: state_slug + district_slug + limit + sortBy → return top N tehsils sorted
    if (state_slug && district_slug && searchParams.get("limit")) {
      const limit = parseInt(searchParams.get("limit"));
      const sortBy = searchParams.get("sortBy");

      const sortMap = {
        population: { total_population: -1 },
        literate: { literates_total_percent: -1 },
      };

      const sortQuery = sortMap[sortBy] ?? { tehsil: 1 };

      const tehsils = await Tehsil.find({ state_slug, district_slug })
        .sort(sortQuery)
        .limit(limit)
        .select("tehsil tehsil_slug state_slug district_slug")
        .lean();

      return NextResponse.json({ allTehsils: tehsils }, { status: 200 });
    }

    // Case 2: Only state_slug provided → return all tehsils for that state
    if (state_slug && district_slug) {
      const tehsils = await Tehsil.find({ state_slug, district_slug })
        .sort({ block_tehsil: 1 })
        .select(
          "tehsil tehsil_slug total_population total_tehsils state_slug district_slug total_villages sex_ratio_percent literates_total_percent",
        )
        .lean();

      return NextResponse.json({ allTehsils: tehsils }, { status: 200 });
    }

    // No params → error (require at least state_slug)
    return NextResponse.json(
      { error: "state_slug parameter is required" },
      { status: 400 },
    );
  } catch (error) {
    console.error("GET /tehsils error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tehsils", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Request body is empty or invalid" },
        { status: 400 },
      );
    }

    // ✅ Convert empty values to null
    Object.keys(body).forEach((key) => {
      const value = body[key];

      // Only set to null if it's ACTUALLY empty, not if it's a valid number
      if (value === null || value === undefined || value === "") {
        body[key] = null;
      }
      // Don't touch numbers, even if they're 0
    });

    const tehsil = await Tehsil.findOneAndUpdate(
      { tehsil_id: body.tehsil_id },
      { $set: body }, // Direct update without $set works when upsert is true
      {
        returnDocument: "after", // Return updated doc
        upsert: true, // Create if not exists
        runValidators: true, // Validate
        overwrite: false, // Don't replace entire doc, just update fields
      },
    );

    // ✅ Clear cache after successful update
    revalidateTag("tehsils", "max");

    return NextResponse.json(tehsil, { status: 201 });
  } catch (error) {
    console.error("POST /tehsils error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { error: "Validation failed", details: messages },
        { status: 422 },
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate entry", details: error.keyValue },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create district", details: error.message },
      { status: 500 },
    );
  }
}
