import About from "@/components/About";
import Administrative from "@/components/Administrative";
import Amenities from "@/components/Amenities";
import BlogSection from "@/components/BlogSection";
import Breadcrumb from "@/components/Breadcrumb";
import HtmlContent from "@/components/htmlContent";
import Literacy from "@/components/Literacy";
import Map from "@/components/Map";
import PopularList from "@/components/PopularList";
import Population from "@/components/Population";
import TopChip from "@/components/TopChip";
import TopLeft from "@/components/TopLeft";
import Workers from "@/components/Workers";
import { getContent, getVillages } from "@/utils/common";
import { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { HOST } from "@/lib/constants/constants";
import VillageSchema from "@/components/VillageSchema";

export const revalidate = 3600;
export const dynamicParams = true;

// ────────────────────────────────────────────────────────────
// Cached fetchers — deduplicate calls between metadata + page
// ────────────────────────────────────────────────────────────
const getCachedVillage = cache(
  (state: string, district: string, tehsil: string, village: string) =>
    getVillages({
      state_slug: state,
      district_slug: district,
      block_slug: tehsil,
      village_slug: village,
    }),
);

const getCachedContent = cache(
  (state: string, district: string, tehsil: string, village: string) =>
    getContent("village", {
      state_slug: state,
      district_slug: district,
      block_slug: tehsil,
      village_slug: village,
    }),
);

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────
type VillageSlug = {
  state_slug: string;
  district_slug: string;
  tehsil_slug: string;
  village_slug: string;
};

type VillageItem = {
  village: string;
  total_population: number;
  number_of_households: number;
  sex_ratio_percent: number;
  literates_total_percent: number;
  state_slug: string;
  district_slug: string;
  tehsil_slug: string;
  village_slug: string;
};

type Props = {
  params: Promise<{
    state: string;
    district: string;
    tehsil: string;
    village: string;
  }>;
};

// ────────────────────────────────────────────────────────────
// Static params
// ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const countRes = await fetch(`${process.env.HOST}/api/village`, {
      cache: "no-store",
    });
    const { totalVillages } = await countRes.json();
    if (!totalVillages) return [];

    const LIMIT = 1000;
    const totalPages = Math.ceil(totalVillages / LIMIT);

    const pages = await Promise.all(
      Array.from({ length: totalPages }, (_, i) =>
        fetch(`${process.env.HOST}/api/village?pageIndex=${i}`, {
          cache: "no-store",
        })
          .then((res) => res.json())
          .then((data) => (data.allVillages ?? []) as VillageSlug[]),
      ),
    );

    return pages
      .flat()
      .filter(
        (v) =>
          v.state_slug && v.district_slug && v.tehsil_slug && v.village_slug,
      )
      .map((v) => ({
        state: v.state_slug,
        district: v.district_slug,
        tehsil: v.tehsil_slug,
        village: v.village_slug,
      }));
  } catch (error) {
    console.error("generateStaticParams error:", error);
    return [];
  }
}

// ────────────────────────────────────────────────────────────
// Metadata
// ────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, district, tehsil, village } = await params;

  const [content, villagesData] = await Promise.all([
    getCachedContent(state, district, tehsil, village),
    getCachedVillage(state, district, tehsil, village),
  ]);

  const title = content?.title || villagesData?.seo_title;
  const description = content?.description || villagesData?.seo_description;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `${HOST}/${state}/${district}/${tehsil}/${village}`,
    },
  };
}

// ────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────
export default async function VillagePage({ params }: Props) {
  const { state, district, tehsil, village } = await params;

  const [villagesData, content, allVillages] = await Promise.all([
    getCachedVillage(state, district, tehsil, village),
    getCachedContent(state, district, tehsil, village),
    getVillages({
      state_slug: state,
      district_slug: district,
      block_slug: tehsil,
      limit: 5,
    }),
  ]);

  if (!villagesData || villagesData?.status === 404) notFound();

  const v = villagesData; // short alias to reduce repetition below

  const breadcrumbData = [
    { label: "Home", redirectionUrl: "/" },
    { label: state, redirectionUrl: `/${state}` },
    { label: district, redirectionUrl: `/${state}/${district}` },
    { label: tehsil, redirectionUrl: `/${state}/${district}/${tehsil}` },
    { label: v.village, redirectionUrl: null },
  ];

  const adminData = [
    { label: "Village", value: v.village },
    { label: "Tehsil", value: v.tehsil },
    { label: "District", value: v.district },
    { label: "State", value: v.state },
    { label: "Country", value: v.country },
    { label: "PIN Code", value: v.pin_code },
    { label: "Total Area", value: v.total_area_sq_km },
    { label: "Total Households", value: v.number_of_households },
    { label: "Nearest Town", value: v.nearest_town },
    { label: "Main Occupation", value: v.main_occupation },
    { label: "Latitude / Longitude", value: `${v.latitude}, ${v.longitude}` },
    { label: "Census Year", value: v.census_year },
  ];

  const overAllPopulation = [
    { label: "Total", value: v.total_population },
    { label: "Male", value: v.total_population_males },
    { label: "Female", value: v.total_population_females },
    { label: "Sex Ratio", value: v.sex_ratio_percent },
  ];

  const childrenPopulation = [
    { label: "Total (0-6 Yrs)", value: v.population_0_6_years_total },
    { label: "Male (0-6 Yrs)", value: v.population_0_6_years_males },
    { label: "Female (0-6 Yrs)", value: v.population_0_6_years_females },
  ];

  const scStPopulation = [
    {
      label: "SC",
      value: [
        { label: "Total", value: v.scheduled_caste_population_total },
        { label: "Male", value: v.scheduled_caste_population_males },
        { label: "Female", value: v.scheduled_caste_population_females },
        { label: "% Share", value: v.scheduled_caste_population_total_percent },
      ],
    },
    {
      label: "ST",
      value: [
        { label: "Total", value: v.scheduled_tribe_population_total },
        { label: "Male", value: v.scheduled_tribe_population_males },
        { label: "Female", value: v.scheduled_tribe_population_females },
        { label: "% Share", value: v.scheduled_tribe_population_total_percent },
      ],
    },
  ];

  const literacyData = [
    {
      label: "Total Literates",
      value: v.literates_total,
      percent: v.literates_total_percent,
    },
    {
      label: "Male Literates",
      value: v.literates_males,
      percent: v.literates_males_percent,
    },
    {
      label: "Female Literates",
      value: v.literates_females,
      percent: v.literates_females_percent,
    },
  ];

  const workerData = [
    {
      label: "Total Workers",
      value: v.total_workers,
      percent: v.total_workers_percent,
    },
    {
      label: "Male Workers",
      value: v.total_workers_males,
      percent: v.total_workers_males_percent,
    },
    {
      label: "Female Workers",
      value: v.total_workers_females,
      percent: v.total_workers_females_percent,
    },
  ];

  const amenitiesData = [
    { icon: "🎓", name: "Education", value: v.education_facilities },
    { icon: "🏥", name: "Medical", value: v.medical_facilities },
    { icon: "💧", name: "Drinking Water", value: v.drinking_water_facilities },
    { icon: "🏦", name: "Bank", value: v.bank_facilities },
  ];

  const tehsilVillages = [
    ...(allVillages ?? [])
      .filter((item: VillageItem) => item?.village !== villagesData?.village) // ← exclude current village
      .map((item: VillageItem) => ({
        name: item?.village,
        redirectionUrl: `/${item.state_slug}/${item.district_slug}/${item?.tehsil_slug}/${item?.village_slug}`,
      })),
    {
      name: `All ${villagesData?.tehsil} Villages`,
      redirectionUrl: `/${villagesData.state_slug}/${villagesData.district_slug}/${villagesData.tehsil}`,
    },
  ];

  const villageTopLinks = [
    {
      name: `${villagesData?.tehsil} Tehsil`,
      redirectionUrl: `/${villagesData.state_slug}/${villagesData.district_slug}/${villagesData?.tehsil}`,
    },
    {
      name: `${villagesData?.district} District`,
      redirectionUrl: `/${villagesData.state_slug}/${villagesData.district_slug}`,
    },
    {
      name: `${villagesData?.state} State`,
      redirectionUrl: `/${villagesData.state_slug}`,
    },
  ];

  return (
    <>
      <VillageSchema
        v={villagesData}
        state_slug={state}
        district_slug={district}
        tehsil_slug={tehsil}
      />
      <main className="m-auto flex w-full flex-wrap p-4 md:max-w-275">
        <Breadcrumb data={breadcrumbData} />

        <div className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-linear-to-b from-slate-50 to-white p-4.5 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
          <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
            <div className="flex w-full flex-col gap-4 md:w-2/3">
              <h1 className="text-lg font-bold md:text-2xl">
                {v.village} Village Population, Sex Ratio & Literacy Rate
              </h1>

              {content.top_content ? (
                <HtmlContent
                  type="top"
                  content={content.top_content}
                  customClass="mb-0"
                />
              ) : (
                <>
                  <p className="text-sm text-slate-700">
                    {v.village} is a village in {v.tehsil} tehsil, {v.district}{" "}
                    district, {v.state}, {v.country}. As per Census{" "}
                    {v.census_year}, the total population is{" "}
                    {v.total_population}, sex ratio is {v.sex_ratio_percent}{" "}
                    females per 1,000 males, and the overall literacy rate is{" "}
                    {parseFloat(v.literates_total_percent).toFixed(2)}%. The PIN
                    code of {v.village} is {v.pin_code}.
                  </p>
                  <p className="rounded-md border border-gray-200 bg-gray-100 p-2 text-sm text-slate-700">
                    ℹ️ Source: Office of the Registrar General &amp; Census
                    Commissioner, India — Census {v.census_year}
                  </p>
                </>
              )}
            </div>

            <TopLeft
              title="Village at a Glance"
              subHeading={v.village}
              data={[
                { label: "Tehsil", value: v.tehsil },
                { label: "District", value: v.district },
                { label: "State", value: v.state },
                { label: "PIN Code", value: v.pin_code },
                { label: "Nearest Town", value: v.nearest_town },
                { label: "Main Occupation", value: v.main_occupation },
                { label: "Census Year", value: v.census_year },
              ]}
            />
          </div>

          <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
            <TopChip heading="Total Population" value={v.total_population} />
            <TopChip
              heading="Sex Ratio"
              value={v.sex_ratio_percent}
              isShowPercent
            />
            <TopChip
              heading="Literacy Rate"
              value={v.literates_total_percent}
              isShowPercent
            />
            <TopChip heading="Households" value={v.number_of_households} />
            <TopChip heading="Area" value={v.total_area_sq_km} />
          </div>
        </div>

        <div className="mt-4 flex w-full flex-wrap gap-4 md:flex-nowrap">
          <div className="w-full md:w-2/3">
            <Map
              heading={v.village}
              lat={v.latitude}
              long={v.longitude}
              nearest_town={v.nearest_town}
            />
            <Administrative heading={v.village} data={adminData} />
            <Amenities heading={v.village} data={amenitiesData} />
            <Population
              heading={v.village}
              year={v.census_year}
              overAllPopulation={overAllPopulation}
              childrenPopulation={childrenPopulation}
              scStPopulation={scStPopulation}
            />
            <Literacy heading={v.village} data={literacyData} />
            <Workers heading={v.village} data={workerData} />
          </div>

          <div className="sticky top-18 flex w-full flex-col gap-4 self-start md:w-1/3">
            <About type="village" name={v.village} />
            {tehsilVillages?.length > 0 && (
              <PopularList
                heading="Explore Other Villages"
                listData={tehsilVillages}
              />
            )}
            {villageTopLinks?.length > 0 && (
              <PopularList
                heading={`Go to ${v.village}`}
                listData={villageTopLinks}
              />
            )}
          </div>
        </div>

        {content?.blog_content && (
          <BlogSection blogData={content.blog_content} />
        )}
        {content?.bottom_content && (
          <HtmlContent type="bottom" content={content.bottom_content} />
        )}
      </main>
    </>
  );
}
