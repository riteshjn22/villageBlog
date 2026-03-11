import mongoose from "mongoose";

const TehsilSchema = new mongoose.Schema(
  {
    // Basic Info
    tehsil_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    tehsil: {
      type: String,
      required: true,
      trim: true,
    },
    tehsil_slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },
    district_slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },
    state_slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    country: {
      type: String,
      required: true,
      default: "India",
      trim: true,
    },

    census_year: {
      type: Number,
      required: true,
    },

    // Administrative
    total_villages: { type: Number, default: 0 },
    number_of_households: { type: Number, default: 0 },

    // Population
    total_population: { type: Number, default: 0 },
    total_population_males: { type: Number, default: 0 },
    total_population_females: { type: Number, default: 0 },
    sex_ratio_percent: { type: Number, default: 0 },

    // Child Population (0–6 years)
    population_0_6_years_total: { type: Number, default: 0 },
    population_0_6_years_males: { type: Number, default: 0 },
    population_0_6_years_females: { type: Number, default: 0 },

    // SC Population
    scheduled_caste_population_total: { type: Number, default: 0 },
    scheduled_caste_population_males: { type: Number, default: 0 },
    scheduled_caste_population_females: { type: Number, default: 0 },
    scheduled_caste_population_total_percent: { type: Number, default: 0 },

    // ST Population
    scheduled_tribe_population_total: { type: Number, default: 0 },
    scheduled_tribe_population_males: { type: Number, default: 0 },
    scheduled_tribe_population_females: { type: Number, default: 0 },
    scheduled_tribe_population_total_percent: { type: Number, default: 0 },

    // Literacy
    literates_total: { type: Number, default: 0 },
    literates_males: { type: Number, default: 0 },
    literates_females: { type: Number, default: 0 },
    literates_total_percent: { type: Number, default: 0 },
    literates_males_percent: { type: Number, default: 0 },
    literates_females_percent: { type: Number, default: 0 },

    // Workers
    total_workers: { type: Number, default: 0 },
    total_workers_males: { type: Number, default: 0 },
    total_workers_females: { type: Number, default: 0 },
    total_workers_percent: { type: Number, default: 0 },
    total_workers_males_percent: { type: Number, default: 0 },
    total_workers_females_percent: { type: Number, default: 0 },

    // Area
    total_area_sq_km: { type: Number, default: 0 },

    // SEO
    seo_title: { type: String, trim: true, default: null },
    seo_description: { type: String, trim: true, default: null },
  },
  {
    timestamps: true,
  },
);

// Indexes for hierarchy lookup
TehsilSchema.index({ state_slug: 1, district_slug: 1 });
TehsilSchema.index({ state_slug: 1, district_slug: 1, tehsil_slug: 1 });

const Tehsil = mongoose.models.Tehsil || mongoose.model("Tehsil", TehsilSchema);

export default Tehsil;
