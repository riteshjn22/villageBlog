import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import State from "@/lib/models/State";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const hasParams = searchParams.toString().length > 0;

    if (hasParams) {
      const all = searchParams.get("all");
      const limit = searchParams.get("limit");

      // If all=true, return all states with full data
      if (all === "true") {
        const states = await State.find().sort({ name: 1 }).lean();
        return NextResponse.json({ allStates: states }, { status: 200 });
      }

      // If limit is provided, return limited states with full data
      if (limit) {
        const limitNum = parseInt(limit, 10);
        if (isNaN(limitNum) || limitNum < 1) {
          return NextResponse.json(
            { error: "Invalid limit value" },
            { status: 400 },
          );
        }
        const states = await State.find()
          .sort({ name: 1 })
          .limit(limitNum)
          .lean();
        return NextResponse.json({ allStates: states }, { status: 200 });
      }

      // Build filter from remaining query parameters
      const filter = {};
      searchParams.forEach((value, key) => {
        filter[key] = value;
      });

      const state = await State.findOne(filter).lean();
      if (!state) {
        return NextResponse.json({ error: "State not found" }, { status: 404 });
      }
      return NextResponse.json(state, { status: 200 });
    } else {
      // No params: return array with only state and state_slug
      const states = await State.find()
        .sort({ name: 1 })
        .select("state state_slug")
        .lean();
      return NextResponse.json({ allStates: states }, { status: 200 });
    }
  } catch (error) {
    console.error("GET /states error:", error);
    return NextResponse.json(
      { error: "Failed to fetch states", details: error.message },
      { status: 500 },
    );
  }
}
