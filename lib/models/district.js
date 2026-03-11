import mongoose from "mongoose";

const DistrictSchema = new mongoose.Schema(
  {
    // ─── Identity ──────────────────────────────────────────────────────────────
    district_id: { type: String, required: true, unique: true, trim: true },
    district: { type: String, required: true, trim: true },
    district_slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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

    // ─── Administrative ────────────────────────────────────────────────────────
    total_tehsils: { type: Number, default: 0 },
    total_villages: { type: Number, default: 0 },
    number_of_households: { type: Number, default: 0 },

    // ─── Population ────────────────────────────────────────────────────────────
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

    // ─── Religion ──────────────────────────────────────────────────────────────
    hindu_population: { type: Number, default: 0 },
    muslim_population: { type: Number, default: 0 },
    christian_population: { type: Number, default: 0 },
    sikh_population: { type: Number, default: 0 },
    jain_population: { type: Number, default: 0 },
    buddhist_population: { type: Number, default: 0 },

    hindu_population_percent: { type: Number, default: 0 },
    muslim_population_percent: { type: Number, default: 0 },
    christian_population_percent: { type: Number, default: 0 },
    sikh_population_percent: { type: Number, default: 0 },
    jain_population_percent: { type: Number, default: 0 },
    buddhist_population_percent: { type: Number, default: 0 },

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

    // ─── Infrastructure ────────────────────────────────────────────────────────
    nearest_railway_station: { type: String, trim: true, default: null },
    nearest_airport: { type: String, trim: true, default: null },

    // ─── SEO ───────────────────────────────────────────────────────────────────
    seo_title: { type: String, trim: true, default: null },
    seo_description: { type: String, trim: true, default: null },
  },
  {
    timestamps: true,
  },
);

// ─── Indexes ───────────────────────────────────────────────────────────────────
DistrictSchema.index({ district: 1 });
DistrictSchema.index({ district_slug: 1 });
DistrictSchema.index({ state_slug: 1, district_slug: 1 }); // compound for state+district lookups

const District =
  mongoose.models.District || mongoose.model("District", DistrictSchema);

export default District;
