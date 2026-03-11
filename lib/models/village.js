import mongoose from "mongoose";

const VillageSchema = new mongoose.Schema(
  {
    // ─── Identity ──────────────────────────────────────────────────────────────
    village_id: { type: String, required: true, unique: true, trim: true },
    village: { type: String, required: true, trim: true },
    village_slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    tehsil: { type: String, required: true, trim: true },
    tehsil_slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    district: { type: String, required: true, trim: true },
    district_slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    state: { type: String, required: true, trim: true },
    state_slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    country: { type: String, required: true, default: "India", trim: true },
    census_year: { type: Number, required: true },
    pin_code: { type: Number, default: null },

    // ─── Population ────────────────────────────────────────────────────────────
    number_of_households: { type: Number, default: 0 },
    total_population: { type: Number, default: 0 },
    total_population_males: { type: Number, default: 0 },
    total_population_females: { type: Number, default: 0 },
    sex_ratio_percent: { type: Number, default: 0 },

    // Children (0–6 years)
    population_0_6_years_total: { type: Number, default: 0 },
    population_0_6_years_males: { type: Number, default: 0 },
    population_0_6_years_females: { type: Number, default: 0 },

    // Scheduled Caste
    scheduled_caste_population_total: { type: Number, default: 0 },
    scheduled_caste_population_males: { type: Number, default: 0 },
    scheduled_caste_population_females: { type: Number, default: 0 },
    scheduled_caste_population_total_percent: { type: Number, default: 0 },

    // Scheduled Tribe
    scheduled_tribe_population_total: { type: Number, default: 0 },
    scheduled_tribe_population_males: { type: Number, default: 0 },
    scheduled_tribe_population_females: { type: Number, default: 0 },
    scheduled_tribe_population_total_percent: { type: Number, default: 0 },

    // ─── Literacy ──────────────────────────────────────────────────────────────
    literates_total: { type: Number, default: 0 },
    literates_males: { type: Number, default: 0 },
    literates_females: { type: Number, default: 0 },

    literates_total_percent: { type: Number, default: 0 },
    literates_males_percent: { type: Number, default: 0 },
    literates_females_percent: { type: Number, default: 0 },

    // ─── Workers ───────────────────────────────────────────────────────────────
    total_workers: { type: Number, default: 0 },
    total_workers_males: { type: Number, default: 0 },
    total_workers_females: { type: Number, default: 0 },

    total_workers_percent: { type: Number, default: 0 },
    total_workers_males_percent: { type: Number, default: 0 },
    total_workers_females_percent: { type: Number, default: 0 },

    // ─── Geography ─────────────────────────────────────────────────────────────
    total_area_sq_km: { type: Number, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },

    // ─── Facilities ────────────────────────────────────────────────────────────
    education_facilities: { type: Number, default: null },
    medical_facilities: { type: Number, default: null },
    drinking_water_facilities: { type: Number, default: null },
    bank_facilities: { type: Number, default: null },

    // ─── Local Info ────────────────────────────────────────────────────────────
    nearest_town: { type: String, trim: true, default: null },
    main_occupation: { type: String, trim: true, default: null },

    // ─── SEO ───────────────────────────────────────────────────────────────────
    seo_title: { type: String, trim: true, default: null },
    seo_description: { type: String, trim: true, default: null },
  },
  {
    timestamps: true,
  },
);

// ─── Indexes ───────────────────────────────────────────────────────────────────
VillageSchema.index({ village_slug: 1 });
VillageSchema.index({ tehsil_slug: 1 });
VillageSchema.index({ state_slug: 1, district_slug: 1 });
VillageSchema.index({ state_slug: 1, district_slug: 1, tehsil_slug: 1 });
VillageSchema.index({
  state_slug: 1,
  district_slug: 1,
  tehsil_slug: 1,
  village_slug: 1,
}); // full hierarchy

const Village =
  mongoose.models.Village || mongoose.model("Village", VillageSchema);

export default Village;
