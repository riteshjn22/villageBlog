import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Village from "@/lib/models/village";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");
    const limit = searchParams.get("limit");

    // If all=true, return all villages with full data
    if (all === "true") {
      const villages = await Village.find().sort({ village_name: 1 }).lean();
      return NextResponse.json({ allVillages: villages }, { status: 200 });
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
      const villages = await Village.find()
        .sort({ village_name: 1 })
        .limit(limitNum)
        .lean();
      return NextResponse.json({ allVillages: villages }, { status: 200 });
    }

    // No params: return all villages with only essential fields
    const villages = await Village.find()
      .sort({ village_name: 1 })
      .select("village_name village_slug total_population nearest_town")
      .lean();

    return NextResponse.json({ allVillages: villages }, { status: 200 });
  } catch (error) {
    console.error("GET /villages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch villages", details: error.message },
      { status: 500 },
    );
  }
}
