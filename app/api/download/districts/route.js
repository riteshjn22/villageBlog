import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import District from "@/lib/models/district";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const hasParams = searchParams.toString().length > 0;

    if (hasParams) {
      const all = searchParams.get("all");
      const limit = searchParams.get("limit");

      // If all=true, return all districts with full data
      if (all === "true") {
        const districts = await District.find().sort({ name: 1 }).lean();
        return NextResponse.json({ allDistricts: districts }, { status: 200 });
      }

      // If limit is provided, return limited districts with full data
      if (limit) {
        const limitNum = parseInt(limit, 10);
        if (isNaN(limitNum) || limitNum < 1) {
          return NextResponse.json(
            { error: "Invalid limit value" },
            { status: 400 },
          );
        }
        const districts = await District.find()
          .sort({ name: 1 })
          .limit(limitNum)
          .lean();
        return NextResponse.json({ allDistricts: districts }, { status: 200 });
      }

      // Build filter from remaining query parameters
      const filter = {};
      searchParams.forEach((value, key) => {
        filter[key] = value;
      });

      const district = await District.findOne(filter).lean();
      if (!district) {
        return NextResponse.json(
          { error: "District not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(district, { status: 200 });
    } else {
      // No params: return array with only district name and slug
      const districts = await District.find()
        .sort({ name: 1 })
        .select("district district_slug")
        .lean();
      return NextResponse.json({ allDistricts: districts }, { status: 200 });
    }
  } catch (error) {
    console.error("GET /districts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch districts", details: error.message },
      { status: 500 },
    );
  }
}
