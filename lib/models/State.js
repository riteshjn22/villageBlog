import mongoose from "mongoose";

const StateSchema = new mongoose.Schema(
  {
    state_id: { type: String, required: true, unique: true, trim: true },
    state: { type: String, required: true, trim: true },
    state_slug: { type: String, required: true, unique: true, trim: true },
    country: { type: String, trim: true },
    census_year: { type: Number, required: true },

    total_districts: { type: Number, default: 0 },
    total_tehsils: { type: Number, default: 0 },
    total_villages: { type: Number, default: 0 },
    number_of_households: { type: Number, default: 0 },

    total_population: { type: Number, default: 0 },
    total_population_males: { type: Number, default: 0 },
    total_population_females: { type: Number, default: 0 },
    sex_ratio_percent: { type: Number, default: 0 },

    population_0_6_years_total: { type: Number, default: 0 },
    population_0_6_years_males: { type: Number, default: 0 },
    population_0_6_years_females: { type: Number, default: 0 },

    scheduled_caste_population_total: { type: Number, default: 0 },
    scheduled_caste_population_males: { type: Number, default: 0 },
    scheduled_caste_population_females: { type: Number, default: 0 },

    scheduled_tribe_population_total: { type: Number, default: 0 },
    scheduled_tribe_population_males: { type: Number, default: 0 },
    scheduled_tribe_population_females: { type: Number, default: 0 },

    scheduled_caste_population_total_percent: { type: Number, default: 0 },
    scheduled_tribe_population_total_percent: { type: Number, default: 0 },

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
    Buddhist_population_percent: { type: Number, default: 0 },

    literates_total: { type: Number, default: 0 },
    literates_males: { type: Number, default: 0 },
    literates_females: { type: Number, default: 0 },

    literates_total_percent: { type: Number, default: 0 },
    literates_males_percent: { type: Number, default: 0 },
    literates_females_percent: { type: Number, default: 0 },

    total_workers: { type: Number, default: 0 },
    total_workers_males: { type: Number, default: 0 },
    total_workers_females: { type: Number, default: 0 },

    total_workers_percent: { type: Number, default: 0 },
    total_workers_males_percent: { type: Number, default: 0 },
    total_workers_females_percent: { type: Number, default: 0 },

    capital: { type: String, trim: true },
    high_court: { type: String, trim: true },
    total_area_sq_km: { type: Number, default: 0 },

    seo_title: { type: String, trim: true },
    seo_description: { type: String, trim: true },
  },
  { timestamps: true },
);

const State = mongoose.models.State || mongoose.model("State", StateSchema);

export default State;
