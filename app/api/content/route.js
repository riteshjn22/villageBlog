import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Content from "@/lib/models/content";

// GET /api/content?page_id=home
// GET /api/content?page_id=state&state_slug=maharashtra
// GET /api/content?page_id=district&state_slug=maharashtra&district_slug=pune
// GET /api/content?page_id=block&state_slug=maharashtra&district_slug=pune&tehsil_slug=haveli
// GET /api/content?page_id=village&state_slug=maharashtra&district_slug=pune&tehsil_slug=haveli&village_slug=uruli
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page_id = searchParams.get("page_id");
    const state_slug = searchParams.get("state_slug");
    const district_slug = searchParams.get("district_slug");
    const tehsil_slug = searchParams.get("tehsil_slug");
    const village_slug = searchParams.get("village_slug");

    if (!page_id) {
      return NextResponse.json(
        { error: "page_id is required" },
        { status: 400 },
      );
    }

    const query = buildSlugQuery(page_id, {
      state_slug,
      district_slug,
      tehsil_slug,
      village_slug,
    });

    const content = await Content.findOne(query);

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    console.error("GET /content error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content", details: error.message },
      { status: 500 },
    );
  }
}

// POST /api/content
// Body for home:    { page_id: "home", title, description, top_content, bottom_content, blog_content }
// Body for state:   { page_id: "state", state_slug, ...fields }
// Body for district:{ page_id: "district", state_slug, district_slug, ...fields }
// Body for block:   { page_id: "block", state_slug, district_slug, tehsil_slug, ...fields }
// Body for village: { page_id: "village", state_slug, district_slug, tehsil_slug, village_slug, ...fields }
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      page_id,
      state_slug,
      district_slug,
      tehsil_slug,
      village_slug,
      title,
      description,
      top_content,
      bottom_content,
      blog_content,
    } = body;

    if (!page_id) {
      return NextResponse.json(
        { error: "page_id is required" },
        { status: 400 },
      );
    }

    // Validate required slugs per page_id level
    const slugError = validateSlugs(page_id, {
      state_slug,
      district_slug,
      tehsil_slug,
      village_slug,
    });
    if (slugError) {
      return NextResponse.json({ error: slugError }, { status: 400 });
    }

    const filter = buildSlugQuery(page_id, {
      state_slug,
      district_slug,
      tehsil_slug,
      village_slug,
    });

    const content = await Content.findOneAndUpdate(
      filter,
      {
        $set: {
          title,
          description,
          top_content,
          bottom_content,
          // save null instead of empty string for blog_content
          blog_content: blog_content || null,
        },
        $setOnInsert: {
          page_id,
          ...(state_slug !== undefined && { state_slug }),
          ...(district_slug !== undefined && { district_slug }),
          ...(tehsil_slug !== undefined && { tehsil_slug }),
          ...(village_slug !== undefined && { village_slug }),
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      },
    );
    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    console.error("POST /content error:", error);
    return NextResponse.json(
      { error: "Failed to save content", details: error.message },
      { status: 500 },
    );
  }
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

// Builds the MongoDB filter based on page_id level
function buildSlugQuery(
  page_id,
  { state_slug, district_slug, tehsil_slug, village_slug },
) {
  const query = { page_id };

  switch (page_id.toLowerCase()) {
    case "village":
      if (village_slug) query.village_slug = village_slug;
    // falls through
    case "tehsil": // ← add this
      if (tehsil_slug) query.tehsil_slug = tehsil_slug;
    // falls through
    case "district":
      if (district_slug) query.district_slug = district_slug;
    // falls through
    case "state":
      if (state_slug) query.state_slug = state_slug;
      break;
    // "home" needs no slugs
  }

  return query;
}

// Validates that the required slugs are present for the given page_id level
function validateSlugs(
  page_id,
  { state_slug, district_slug, tehsil_slug, village_slug },
) {
  switch (page_id.toLowerCase()) {
    case "state":
      if (!state_slug) return "state_slug is required for page_id=state";
      break;
    case "district":
      if (!state_slug) return "state_slug is required for page_id=district";
      if (!district_slug)
        return "district_slug is required for page_id=district";
      break;
    case "tehsil": // ← add this
      if (!state_slug) return "state_slug is required for page_id=block";
      if (!district_slug) return "district_slug is required for page_id=block";
      if (!tehsil_slug) return "tehsil_slug is required for page_id=block";
      break;
    case "village":
      if (!state_slug) return "state_slug is required for page_id=village";
      if (!district_slug)
        return "district_slug is required for page_id=village";
      if (!tehsil_slug) return "tehsil_slug is required for page_id=village";
      if (!village_slug) return "village_slug is required for page_id=village";
      break;
  }
  return null;
}
