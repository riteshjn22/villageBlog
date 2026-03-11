import { HOST, SITE_NAME } from "@/lib/constants/constants";

type District = {
  district: string;
  district_slug: string;
};

type StateSchemaProps = {
  s: any;
  districts: District[];
};

export default function StateSchema({ s, districts }: StateSchemaProps) {
  const pageUrl = `${HOST}/${s.state_slug}`;

  const place = {
    "@context": "https://schema.org",
    "@type": ["Place", "AdministrativeArea"],
    "@id": `${pageUrl}/`,
    name: s.state,
    alternateName: `${s.state} State`,
    description: `${s.state} is a state in ${s.country} with ${s.total_districts} districts, ${s.total_tehsils} tehsils and ${s.total_villages} villages. As per Census ${s.census_year}, the total population is ${s.total_population} with a literacy rate of ${s.literates_total_percent}% and sex ratio of ${s.sex_ratio_percent} females per 1,000 males.`,
    url: `${pageUrl}/`,
    address: {
      "@type": "PostalAddress",
      addressRegion: s.state,
      addressCountry: "IN",
    },
    containedInPlace: {
      "@type": "Country",
      name: s.country,
      sameAs: "https://www.wikidata.org/wiki/Q668",
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Total Population",
        value: s.total_population,
      },
      {
        "@type": "PropertyValue",
        name: "Sex Ratio",
        value: s.sex_ratio_percent,
        unitText: "females per 1000 males",
      },
      {
        "@type": "PropertyValue",
        name: "Literacy Rate",
        value: s.literates_total_percent,
        unitText: "percent",
      },
      {
        "@type": "PropertyValue",
        name: "Total Districts",
        value: s.total_districts,
      },
      {
        "@type": "PropertyValue",
        name: "Total Tehsils",
        value: s.total_tehsils,
      },
      {
        "@type": "PropertyValue",
        name: "Total Villages",
        value: s.total_villages,
      },
      {
        "@type": "PropertyValue",
        name: "Total Households",
        value: s.number_of_households,
      },
      {
        "@type": "PropertyValue",
        name: "Total Area",
        value: s.total_area_sq_km,
        unitText: "sq km",
      },
      { "@type": "PropertyValue", name: "Capital", value: s.capital },
      { "@type": "PropertyValue", name: "High Court", value: s.high_court },
    ],
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${HOST}/` },
      { "@type": "ListItem", position: 2, name: s.state, item: `${pageUrl}/` },
    ],
  };

  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${s.state} Population, Sex Ratio & Literacy Rate — Census ${s.census_year}`,
    description: `Census ${s.census_year} data for ${s.state} state, ${s.country}. Includes total population, male and female population, sex ratio, literacy rate, scheduled caste and tribe data, religion-wise population, worker participation rate across ${s.total_districts} districts, ${s.total_tehsils} tehsils and ${s.total_villages} villages.`,
    url: `${pageUrl}/`,
    identifier: s.state_id,
    keywords: [
      `${s.state} population`,
      `${s.state} sex ratio`,
      `${s.state} literacy rate`,
      `${s.state} census ${s.census_year}`,
      `${s.state} districts list`,
      `${s.state} religion population`,
      `${s.state} SC ST population`,
    ],
    creator: {
      "@type": "Organization",
      name: "Office of the Registrar General & Census Commissioner, India",
      url: "https://censusindia.gov.in",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: HOST,
    },
    isBasedOn: {
      "@type": "Dataset",
      name: `Census of India ${s.census_year}`,
      description: `Census of India ${s.census_year} is the official population census conducted by the Office of the Registrar General & Census Commissioner, India, covering population, literacy, sex ratio, and socio-economic data across all states, districts, tehsils and villages.`,
      creator: {
        "@type": "Organization",
        name: "Office of the Registrar General & Census Commissioner, India",
        url: "https://censusindia.gov.in",
      },
      license:
        "https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf",
    },
    temporalCoverage: s.census_year,
    spatialCoverage: {
      "@type": "Place",
      name: `${s.state}, ${s.country}`,
    },
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "Total Population",
        value: s.total_population,
      },
      {
        "@type": "PropertyValue",
        name: "Male Population",
        value: s.total_population_males,
      },
      {
        "@type": "PropertyValue",
        name: "Female Population",
        value: s.total_population_females,
      },
      {
        "@type": "PropertyValue",
        name: "Sex Ratio",
        value: s.sex_ratio_percent,
        unitText: "females per 1000 males",
      },
      {
        "@type": "PropertyValue",
        name: "Total Literates",
        value: s.literates_total,
      },
      {
        "@type": "PropertyValue",
        name: "Literacy Rate",
        value: s.literates_total_percent,
        unitText: "percent",
      },
      {
        "@type": "PropertyValue",
        name: "Male Literacy Rate",
        value: s.literates_males_percent,
        unitText: "percent",
      },
      {
        "@type": "PropertyValue",
        name: "Female Literacy Rate",
        value: s.literates_females_percent,
        unitText: "percent",
      },
      {
        "@type": "PropertyValue",
        name: "Total Households",
        value: s.number_of_households,
      },
      {
        "@type": "PropertyValue",
        name: "Scheduled Caste Population",
        value: s.scheduled_caste_population_total,
      },
      {
        "@type": "PropertyValue",
        name: "Scheduled Tribe Population",
        value: s.scheduled_tribe_population_total,
      },
      {
        "@type": "PropertyValue",
        name: "Total Workers",
        value: s.total_workers,
      },
      {
        "@type": "PropertyValue",
        name: "Worker Participation Rate",
        value: s.total_workers_percent,
        unitText: "percent",
      },
      {
        "@type": "PropertyValue",
        name: "Total Districts",
        value: s.total_districts,
      },
      {
        "@type": "PropertyValue",
        name: "Total Tehsils",
        value: s.total_tehsils,
      },
      {
        "@type": "PropertyValue",
        name: "Total Villages",
        value: s.total_villages,
      },
    ],
    license: `${HOST}/terms/`,
    isAccessibleForFree: true,
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Districts List in ${s.state}`,
    description: `List of all ${s.total_districts} districts in ${s.state} with population, total tehsils, sex ratio and literacy rate as per Census ${s.census_year}.`,
    url: `${pageUrl}/`,
    numberOfItems: s.total_districts,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: districts?.map((district, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": ["Place", "AdministrativeArea"],
        name: district.district,
        url: `${HOST}/${s.state_slug}/${district.district_slug}/`,
        containedInPlace: {
          "@type": ["Place", "AdministrativeArea"],
          name: s.state,
          url: `${pageUrl}/`,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(place) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dataset) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
    </>
  );
}
