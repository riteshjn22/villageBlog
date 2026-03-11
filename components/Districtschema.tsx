import { HOST, SITE_NAME } from "@/lib/constants/constants";

type TehsilItem = {
  tehsil: string;
  tehsil_slug?: string;
};

type DistrictSchemaProps = {
  d: any;
  state_slug: string;
  tehsils: TehsilItem[];
};

export default function DistrictSchema({
  d,
  state_slug,
  tehsils,
}: DistrictSchemaProps) {
  const pageUrl = `${HOST}/${state_slug}/${d.district_slug}`;

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
        item: `${pageUrl}/`,
      },
    ],
  };

  const place = {
    "@context": "https://schema.org",
    "@type": ["Place", "AdministrativeArea"],
    "@id": `${pageUrl}/`,
    name: d.district,
    alternateName: `${d.district} District`,
    description: `${d.district} is a district in ${d.state}, ${d.country} with ${d.total_tehsils} tehsils and ${d.total_villages} villages. As per Census ${d.census_year}, the total population is ${d.total_population} with a literacy rate of ${d.literates_total_percent}% and sex ratio of ${d.sex_ratio_percent} females per 1,000 males.`,
    url: `${pageUrl}/`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: d.latitude,
      longitude: d.longitude,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: d.district,
      addressRegion: d.state,
      addressCountry: "IN",
    },
    containedInPlace: {
      "@type": ["Place", "AdministrativeArea"],
      name: d.state,
      url: `${HOST}/${state_slug}/`,
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
        name: "Total Tehsils",
        value: d.total_tehsils,
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
      {
        "@type": "PropertyValue",
        name: "Nearest Railway Station",
        value: d.nearest_railway_station,
      },
      {
        "@type": "PropertyValue",
        name: "Nearest Airport",
        value: d.nearest_airport,
      },
    ],
  };

  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${d.district} Population, Sex Ratio & Literacy Rate \u2014 Census ${d.census_year}`,
    description: `Census ${d.census_year} data for ${d.district} district, ${d.state}, ${d.country}. Includes total population, male and female population, sex ratio, literacy rate, scheduled caste and tribe data, religion-wise population and worker participation rate across ${d.total_tehsils} tehsils and ${d.total_villages} villages.`,
    url: `${pageUrl}/`,
    identifier: d.district_id,
    keywords: [
      `${d.district} population`,
      `${d.district} sex ratio`,
      `${d.district} literacy rate`,
      `${d.district} census ${d.census_year}`,
      `${d.district} tehsils list`,
      `${d.district} ${d.state} census data`,
      `${d.district} SC ST population`,
    ],
    creator: {
      "@type": "Organization",
      name: "Office of the Registrar General & Census Commissioner, India",
      url: "https://censusindia.gov.in",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: `${HOST}/`,
    },
    isBasedOn: {
      "@type": "Dataset",
      name: `Census of India ${d.census_year}`,
      description: `Census of India ${d.census_year} is the official population census conducted by the Office of the Registrar General & Census Commissioner, India, covering population, literacy, sex ratio, and socio-economic data across all states, districts, tehsils and villages.`,
      creator: {
        "@type": "Organization",
        name: "Office of the Registrar General & Census Commissioner, India",
        url: "https://censusindia.gov.in",
      },
      license:
        "https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf",
    },
    temporalCoverage: d.census_year,
    spatialCoverage: {
      "@type": "Place",
      name: `${d.district}, ${d.state}, ${d.country}`,
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
      {
        "@type": "PropertyValue",
        name: "Total Tehsils",
        value: d.total_tehsils,
      },
      {
        "@type": "PropertyValue",
        name: "Total Villages",
        value: d.total_villages,
      },
    ],
    license: `${HOST}/terms/`,
    isAccessibleForFree: true,
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Tehsils List in ${d.district}`,
    description: `List of all ${d.total_tehsils} tehsils in ${d.district} district, ${d.state} with population, total villages, sex ratio and literacy rate as per Census ${d.census_year}.`,
    url: `${pageUrl}/`,
    numberOfItems: d.total_tehsils,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: tehsils?.map((tehsil, index) => {
      const slug =
        tehsil.tehsil_slug ?? tehsil.tehsil.toLowerCase().replace(/\s+/g, "-");
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": ["Place", "AdministrativeArea"],
          name: tehsil.tehsil,
          url: `${HOST}/${state_slug}/${d.district_slug}/${slug}/`,
          containedInPlace: {
            "@type": ["Place", "AdministrativeArea"],
            name: d.district,
            url: `${pageUrl}/`,
          },
        },
      };
    }),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dataset) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
    </>
  );
}
