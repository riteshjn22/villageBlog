import { HOST } from "@/lib/constants/constants";

type Props = {
  d: any;
  state_slug: string;
  district_slug: string;
  villages?: any[];
};

export default function TehsilSchema({
  d,
  state_slug,
  district_slug,
  villages,
}: Props) {
  const url = `${HOST}/${state_slug}/${district_slug}/${d.tehsil_slug}/`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${HOST}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: d.state,
        item: `${HOST}/${state_slug}/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: d.district,
        item: `${HOST}/${state_slug}/${district_slug}/`,
      },
      { "@type": "ListItem", position: 4, name: d.tehsil, item: url },
    ],
  };

  const place = {
    "@context": "https://schema.org",
    "@type": ["Place", "AdministrativeArea"],
    "@id": url,
    name: d.tehsil,
    alternateName: `${d.tehsil} Tehsil`,
    description: `${d.tehsil} is a tehsil in ${d.district} district, ${d.state}, ${d.country} with ${d.total_villages} villages. As per Census ${d.census_year}, the total population is ${d.total_population} with a literacy rate of ${d.literates_total_percent}% and sex ratio of ${d.sex_ratio_percent} females per 1,000 males.`,
    url,
    address: {
      "@type": "PostalAddress",
      addressLocality: d.tehsil,
      addressRegion: d.state,
      addressCountry: "IN",
    },
    containedInPlace: {
      "@type": ["Place", "AdministrativeArea"],
      name: d.district,
      url: `${HOST}/${state_slug}/${district_slug}/`,
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Total Population",
        value: d.total_population,
      },
      {
        "@type": "PropertyValue",
        name: "Sex Ratio",
        value: d.sex_ratio_percent,
        unitText: "females per 1000 males",
      },
      {
        "@type": "PropertyValue",
        name: "Literacy Rate",
        value: d.literates_total_percent,
        unitText: "percent",
      },
      {
        "@type": "PropertyValue",
        name: "Total Households",
        value: d.number_of_households,
      },
      {
        "@type": "PropertyValue",
        name: "Total Villages",
        value: d.total_villages,
      },
      {
        "@type": "PropertyValue",
        name: "Total Area",
        value: d.total_area_sq_km,
        unitText: "sq km",
      },
    ],
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Villages List in ${d.tehsil}`,
    description: `List of all ${d.total_villages} villages in ${d.tehsil} tehsil, ${d.district} district, ${d.state} with population, households, sex ratio and literacy rate as per Census ${d.census_year}.`,
    url,
    numberOfItems: d.total_villages,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: villages?.map((v: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": ["Place", "AdministrativeArea"],
        name: v.village,
        url: `${HOST}/${v.state_slug}/${v.district_slug}/${v.tehsil_slug}/${v.village_slug}/`,
        containedInPlace: {
          "@type": ["Place", "AdministrativeArea"],
          name: d.tehsil,
          url,
        },
      },
    })),
  };

  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${d.tehsil} Population, Sex Ratio & Literacy Rate — Census ${d.census_year}`,
    description: `Census ${d.census_year} data for ${d.tehsil} tehsil, ${d.district} district, ${d.state}, ${d.country}. Includes total population, male and female population, sex ratio, literacy rate, scheduled caste and tribe data and worker participation rate across ${d.total_villages} villages.`,
    url,
    identifier: d.tehsil_id,
    keywords: [
      `${d.tehsil} population`,
      `${d.tehsil} sex ratio`,
      `${d.tehsil} literacy rate`,
      `${d.tehsil} census ${d.census_year}`,
      `${d.tehsil} villages list`,
      `${d.tehsil} ${d.district} census data`,
      `${d.tehsil} SC ST population`,
    ],
    creator: {
      "@type": "Organization",
      name: "Office of the Registrar General & Census Commissioner, India",
      url: "https://censusindia.gov.in",
    },
    publisher: {
      "@type": "Organization",
      name: "Village Trends",
      url: HOST,
    },
    isBasedOn: {
      "@type": "Dataset",
      name: `Census of India ${d.census_year}`,
      description: `Census of India ${d.census_year} is the official population census conducted by the Office of the Registrar General & Census Commissioner, India.`,
      creator: {
        "@type": "Organization",
        name: "Office of the Registrar General & Census Commissioner, India",
        url: "https://censusindia.gov.in",
      },
      license:
        "https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf",
    },
    temporalCoverage: String(d.census_year),
    spatialCoverage: {
      "@type": "Place",
      name: `${d.tehsil}, ${d.district}, ${d.state}, ${d.country}`,
    },
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "Total Population",
        value: d.total_population,
      },
      {
        "@type": "PropertyValue",
        name: "Male Population",
        value: d.total_population_males,
      },
      {
        "@type": "PropertyValue",
        name: "Female Population",
        value: d.total_population_females,
      },
      {
        "@type": "PropertyValue",
        name: "Sex Ratio",
        value: d.sex_ratio_percent,
        unitText: "females per 1000 males",
      },
      {
        "@type": "PropertyValue",
        name: "Total Literates",
        value: d.literates_total,
      },
      {
        "@type": "PropertyValue",
        name: "Literacy Rate",
        value: d.literates_total_percent,
        unitText: "percent",
      },
      {
        "@type": "PropertyValue",
        name: "Male Literacy Rate",
        value: d.literates_males_percent,
        unitText: "percent",
      },
      {
        "@type": "PropertyValue",
        name: "Female Literacy Rate",
        value: d.literates_females_percent,
        unitText: "percent",
      },
      {
        "@type": "PropertyValue",
        name: "Total Households",
        value: d.number_of_households,
      },
      {
        "@type": "PropertyValue",
        name: "Scheduled Caste Population",
        value: d.scheduled_caste_population_total,
      },
      {
        "@type": "PropertyValue",
        name: "Scheduled Tribe Population",
        value: d.scheduled_tribe_population_total,
      },
      {
        "@type": "PropertyValue",
        name: "Total Workers",
        value: d.total_workers,
      },
      {
        "@type": "PropertyValue",
        name: "Worker Participation Rate",
        value: d.total_workers_percent,
        unitText: "percent",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(place) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dataset) }}
      />
    </>
  );
}
