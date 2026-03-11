import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    page_id: {
      type: String,
      required: true,
      trim: true,
      // removed unique: true here
    },
    state_slug: {
      type: String,
      default: null,
    },
    district_slug: {
      type: String,
      default: null,
    },
    tehsil_slug: {
      type: String,
      default: null,
    },
    village_slug: {
      type: String,
      default: null,
    },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    top_content: { type: String, default: "" },
    bottom_content: { type: String, default: "" },
    blog_content: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    timestamps: true,
  },
);

// Compound unique index — each combination of page_id + slugs is unique
ContentSchema.index(
  {
    page_id: 1,
    state_slug: 1,
    district_slug: 1,
    tehsil_slug: 1,
    village_slug: 1,
  },
  { unique: true },
);

const Content =
  mongoose.models.Content || mongoose.model("Content", ContentSchema);

export default Content;
