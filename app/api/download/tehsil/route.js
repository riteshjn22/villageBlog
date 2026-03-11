import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Tehsil from "@/lib/models/tehsil";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");
    const limit = searchParams.get("limit");

    // If all=true, return all tehsils with full data
    if (all === "true") {
      const tehsils = await Tehsil.find().sort({ block_tehsil: 1 }).lean();
      return NextResponse.json({ allTehsils: tehsils }, { status: 200 });
    }

    // If limit is provided, return limited tehsils with full data
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (isNaN(limitNum) || limitNum < 1) {
        return NextResponse.json(
          { error: "Invalid limit value" },
          { status: 400 },
        );
      }
      const tehsils = await Tehsil.find()
        .sort({ block_tehsil: 1 })
        .limit(limitNum)
        .lean();
      return NextResponse.json({ allTehsils: tehsils }, { status: 200 });
    }

    // No params: return all tehsils with only essential fields
    const tehsils = await Tehsil.find()
      .sort({ block_tehsil: 1 })
      .select("block_tehsil block_slug state_slug district_slug")
      .lean();

    return NextResponse.json({ allTehsils: tehsils }, { status: 200 });
  } catch (error) {
    console.error("GET /tehsils error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tehsils", details: error.message },
      { status: 500 },
    );
  }
}
