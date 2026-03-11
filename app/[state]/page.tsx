import { getContent, getDistricts, getStates } from "@/utils/common";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import HtmlContent from "@/components/htmlContent";
import BlogSection from "@/components/BlogSection";
import TopLeft from "@/components/TopLeft";
import TopChip from "@/components/TopChip";
import Administrative from "@/components/Administrative";
import Population from "@/components/Population";
import Religion from "@/components/Religion";
import Literacy from "@/components/Literacy";
import Workers from "@/components/Workers";
import List from "@/components/List";
import Breadcrumb from "@/components/Breadcrumb";
import About from "@/components/About";
import PopularList from "@/components/PopularList";
import StateSchema from "@/components/Stateschema";
import { HOST } from "@/lib/constants/constants";

// ─── Types ───────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ state: string }>;
};

type District = {
  _id: string;
  district: string;
  district_slug: string;
  state_slug: string;
  total_tehsils: number;
  total_population: number;
  sex_ratio_percent: number;
  literates_total_percent: number;
};

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;

  const [content, stateData] = await Promise.all([
    getContent("state", { state_slug: state }),
    getStates({ state_slug: state }),
  ]);

  const title =
    content?.title && !content?.error ? content.title : stateData?.seo_title;

  const description =
    content?.description && !content?.error
      ? content.description
      : stateData?.seo_description;

  const image =
    content?.image ||
    stateData?.seo_image || 
    `${HOST}/images/default-share.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${HOST}/${state}`,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: `${HOST}/${state}`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function StatePage({ params }: Props) {
  const { state } = await params;

  const [
    content,
    stateData,
    districts,
    allStates,
    topPopDistricts,
    topLitDistricts,
  ] = await Promise.all([
    getContent("state", { state_slug: state }),
    getStates({ state_slug: state }),
    getDistricts({ state_slug: state }) as Promise<District[]>,
    getStates({ limit: 5 }),
    getDistricts({ state_slug: state, limit: 5, sortBy: "population" }),
    getDistricts({ state_slug: state, limit: 5, sortBy: "literate" }),
  ]);

  if (!stateData || stateData?.status === 404) notFound();

  // ─── Data Shapes ───────────────────────────────────────────────────────────

  const adminData = [
    { label: "State", value: stateData.state },
    { label: "Country", value: stateData.country },
    { label: "Capital", value: stateData.capital },
    { label: "High Court", value: stateData.high_court },
    { label: "Total Area", value: stateData.total_area_sq_km },
    { label: "Total Districts", value: stateData.total_districts },
    { label: "Total Tehsils", value: stateData.total_tehsils },
    { label: "Total Villages", value: stateData.total_villages },
    { label: "Total Households", value: stateData.number_of_households },
    { label: "Census Year", value: stateData.census_year },
  ];

  const overAllPopulation = [
    { label: "Total", value: stateData.total_population },
    { label: "Male", value: stateData.total_population_males },
    { label: "Female", value: stateData.total_population_females },
    { label: "Sex Ratio", value: stateData.sex_ratio_percent },
  ];

  const childrenPopulation = [
    { label: "Total (0-6 Yrs)", value: stateData.population_0_6_years_total },
    { label: "Male (0-6 Yrs)", value: stateData.population_0_6_years_males },
    {
      label: "Female (0-6 Yrs)",
      value: stateData.population_0_6_years_females,
    },
  ];

  const scStPopulation = [
    {
      label: "SC",
      value: [
        { label: "Total", value: stateData.scheduled_caste_population_total },
        { label: "Male", value: stateData.scheduled_caste_population_males },
        {
          label: "Female",
          value: stateData.scheduled_caste_population_females,
        },
        {
          label: "% Share",
          value: stateData.scheduled_caste_population_total_percent,
        },
      ],
    },
    {
      label: "ST",
      value: [
        { label: "Total", value: stateData.scheduled_tribe_population_total },
        { label: "Male", value: stateData.scheduled_tribe_population_males },
        {
          label: "Female",
          value: stateData.scheduled_tribe_population_females,
        },
        {
          label: "% Share",
          value: stateData.scheduled_tribe_population_total_percent,
        },
      ],
    },
  ];

  const religionData = [
    {
      label: "Hindu",
      value: stateData.hindu_population,
      percent: stateData.hindu_population_percent,
    },
    {
      label: "Muslim",
      value: stateData.muslim_population,
      percent: stateData.muslim_population_percent,
    },
    {
      label: "Sikh",
      value: stateData.sikh_population,
      percent: stateData.sikh_population_percent,
    },
    {
      label: "Christian",
      value: stateData.christian_population,
      percent: stateData.christian_population_percent,
    },
    {
      label: "Jain",
      value: stateData.jain_population,
      percent: stateData.jain_population_percent,
    },
    {
      label: "Buddhist",
      value: stateData.buddhist_population,
      percent: stateData.Buddhist_population_percent,
    },
  ];

  const literacyData = [
    {
      label: "Total Literates",
      value: stateData.literates_total,
      percent: stateData.literates_total_percent,
    },
    {
      label: "Male Literates",
      value: stateData.literates_males,
      percent: stateData.literates_males_percent,
    },
    {
      label: "Female Literates",
      value: stateData.literates_females,
      percent: stateData.literates_females_percent,
    },
  ];

  const workerData = [
    {
      label: "Total Workers",
      value: stateData.total_workers,
      percent: stateData.total_workers_percent,
    },
    {
      label: "Male Workers",
      value: stateData.total_workers_males,
      percent: stateData.total_workers_males_percent,
    },
    {
      label: "Female Workers",
      value: stateData.total_workers_females,
      percent: stateData.total_workers_females_percent,
    },
  ];

  const districtData = districts?.map((item) => ({
    name: item.district,
    population: item.total_population,
    total: item.total_tehsils,
    sex_ratio: `${item?.sex_ratio_percent.toFixed(2)}%`,
    literacy_rate: `${item?.literates_total_percent.toFixed(2)}%`,
    district_slug: item?.district_slug,
    state_slug: item?.state_slug,
  }));

  const { state: stateName, census_year } = stateData;

  const breadcrumbData = [
    { label: "Home", redirectionUrl: "/" },
    { label: stateName, redirectionUrl: null },
  ];

  const topStates = [
    ...(allStates ?? []).map((item: { state: string; state_slug: string }) => ({
      name: item.state,
      redirectionUrl: item.state_slug,
    })),
    { name: "View All States", redirectionUrl: "/" },
  ];

  const topPopulatedDistricts = [
    ...(topPopDistricts ?? []).map((item: District) => ({
      name: item.district,
      redirectionUrl: `/${item.state_slug}/${item.district_slug}`,
    })),
  ];

  const topLiterateDistricts = [
    ...(topLitDistricts ?? []).map((item: District) => ({
      name: item.district,
      redirectionUrl: `/${item.state_slug}/${item.district_slug}`,
    })),
  ];
  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="m-auto flex w-full flex-wrap p-4 md:max-w-275">
      <Breadcrumb data={breadcrumbData} />
      <div className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-linear-to-b from-slate-50 to-white p-4.5 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
        <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
          <div className="flex w-full flex-col gap-4 md:w-2/3">
            <h1 className="text-lg font-bold md:text-2xl">
              {stateName} - Population, Sex Ratio & Literacy Rate
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
                  {stateName} is a state in {stateData.country} with{" "}
                  {stateData.total_districts} districts,{" "}
                  {stateData.total_tehsils} tehsils and{" "}
                  {stateData.total_villages} villages. As per Census{" "}
                  {census_year}, the total population is{" "}
                  {stateData.total_population}, sex ratio is{" "}
                  {`${stateData.sex_ratio_percent.toFixed(2)}%`} females per
                  1,000 males, and the overall literacy rate is{" "}
                  {parseFloat(stateData.literates_total_percent).toFixed(2)}%.
                </p>
                <p className="rounded-md border border-gray-200 bg-gray-100 p-2 text-sm text-slate-700">
                  ℹ️ Source: Office of the Registrar General & Census
                  Commissioner, India — Census {census_year}
                </p>
              </>
            )}
          </div>

          <TopLeft
            title="State at a Glance"
            subHeading={stateName}
            data={[
              { label: "Capital", value: stateData.capital },
              { label: "High Court", value: stateData.high_court },
              { label: "Area", value: `${stateData.total_area_sq_km} sq km` },
              { label: "State Code", value: stateData.state_id },
              { label: "Census Year", value: census_year },
            ]}
          />
        </div>

        <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
          <TopChip
            heading="Total Population"
            value={stateData.total_population}
          />
          <TopChip
            heading="Sex Ratio"
            value={stateData.sex_ratio_percent}
            isShowPercent
          />
          <TopChip
            heading="Literacy Rate"
            value={stateData.literates_total_percent}
            isShowPercent
          />
          <TopChip heading="Districts" value={stateData.total_districts} />
          <TopChip heading="Villages" value={stateData.total_villages} />
          <TopChip
            heading="Households"
            value={stateData.number_of_households}
          />
        </div>
      </div>
      <div className="mt-4 flex w-full flex-wrap gap-4 md:flex-nowrap">
        <div className="w-full md:w-2/3">
          <Administrative heading={stateName} data={adminData} />
          <Population
            heading={stateName}
            year={census_year}
            overAllPopulation={overAllPopulation}
            childrenPopulation={childrenPopulation}
            scStPopulation={scStPopulation}
          />
          <Religion heading={stateName} religionData={religionData} />
          <Literacy heading={stateName} data={literacyData} />
          <Workers heading={stateName} data={workerData} />
          <List type="state" heading={stateName} data={districtData} />
        </div>
        <div className="sticky top-18 flex w-full flex-col gap-4 self-start md:w-1/3">
          <About type="state" name={stateName} />
          {topPopulatedDistricts?.length > 0 && (
            <PopularList
              heading={`Top Populated ${stateName} Districts`}
              listData={topPopulatedDistricts}
            />
          )}
          {topLiterateDistricts?.length > 0 && (
            <PopularList
              heading={`Top Literate ${stateName} Districts`}
              listData={topLiterateDistricts}
            />
          )}
          {topStates?.length > 0 && (
            <PopularList
              heading={`Explore Other States `}
              listData={topStates}
            />
          )}
        </div>
      </div>

      {content?.blog_content && <BlogSection blogData={content.blog_content} />}
      {content?.bottom_content && (
        <HtmlContent type="bottom" content={content.bottom_content} />
      )}
      <StateSchema s={stateData} districts={districts} />
    </main>
  );
}
