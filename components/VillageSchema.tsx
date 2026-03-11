import { HOST } from "@/lib/constants/constants";

type Props = {
  v: any;
  state_slug: string;
  district_slug: string;
  tehsil_slug: string;
};

export default function VillageSchema({
  v,
  state_slug,
  district_slug,
  tehsil_slug,
}: Props) {
  const url = `${HOST}/${state_slug}/${district_slug}/${tehsil_slug}/${v.village_slug}/`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${HOST}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: v.state,
        item: `${HOST}/${state_slug}/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: v.district,
        item: `${HOST}/${state_slug}/${district_slug}/`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: v.tehsil,
        item: `${HOST}/${state_slug}/${district_slug}/${tehsil_slug}/`,
      },
      { "@type": "ListItem", position: 5, name: v.village, item: url },
    ],
  };

  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${v.village} Village Population, Sex Ratio & Literacy Rate — Census ${v.census_year}`,
    description: `Census ${v.census_year} data for ${v.village} village in ${v.tehsil} tehsil, ${v.district} district, ${v.state}. Includes total population, male and female population, sex ratio, literacy rate, scheduled caste and tribe data, worker participation rate, and amenities.`,
    url,
    identifier: v.village_id,
    keywords: [
      `${v.village} population`,
      `${v.village} sex ratio`,
      `${v.village} literacy rate`,
      `${v.village} census ${v.census_year}`,
      `${v.district} district villages`,
      `${v.tehsil} tehsil villages`,
      `${v.state} villages census`,
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
      name: `Census of India ${v.census_year}`,
      description: `Census of India ${v.census_year} is the official population census conducted by the Office of the Registrar General & Census Commissioner, India, covering population, literacy, sex ratio, and socio-economic data across all states, districts, tehsils and villages.`,
      creator: {
        "@type": "Organization",
        name: "Office of the Registrar General & Census Commissioner, India",
        url: "https://censusindia.gov.in",
      },
      license:
        "https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf",
    },
    temporalCoverage: String(v.census_year),
    spatialCoverage: {
      "@type": "Place",
      name: `${v.village}, ${v.tehsil}, ${v.district}, ${v.state}, ${v.country}`,
      geo: {
        "@type": "GeoCoordinates",
        latitude: v.latitude,
        longitude: v.longitude,
      },
    },
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "Total Population",
        value: v.total_population,
      },
      {
        "@type": "PropertyValue",
        name: "Male Population",
        value: v.total_population_males,
      },
      {
        "@type": "PropertyValue",
        name: "Female Population",
        value: v.total_population_females,
      },
      {
        "@type": "PropertyValue",
        name: "Sex Ratio",
        value: v.sex_ratio_percent,
        unitText: "females per 1000 males",
      },
      {
        "@type": "PropertyValue",
        name: "Total Literates",
        value: v.literates_total,
      },
      {
        "@type": "PropertyValue",
        name: "Literacy Rate",
        value: v.literates_total_percent,
        unitText: "percent",
      },
      {
        "@type": "PropertyValue",
        name: "Male Literacy Rate",
        value: v.literates_males_percent,
        unitText: "percent",
      },
      {
        "@type": "PropertyValue",
        name: "Female Literacy Rate",
        value: v.literates_females_percent,
        unitText: "percent",
      },
      {
        "@type": "PropertyValue",
        name: "Total Households",
        value: v.number_of_households,
      },
      {
        "@type": "PropertyValue",
        name: "Scheduled Caste Population",
        value: v.scheduled_caste_population_total,
      },
      {
        "@type": "PropertyValue",
        name: "Scheduled Tribe Population",
        value: v.scheduled_tribe_population_total,
      },
      {
        "@type": "PropertyValue",
        name: "Total Workers",
        value: v.total_workers,
      },
      {
        "@type": "PropertyValue",
        name: "Worker Participation Rate",
        value: v.total_workers_percent,
        unitText: "percent",
      },
    ],
    license: `${HOST}/terms/`,
    isAccessibleForFree: true,
  };

  const place = {
    "@context": "https://schema.org",
    "@type": ["Place", "AdministrativeArea"],
    "@id": url,
    name: v.village,
    alternateName: `${v.village} Village`,
    description: `${v.village} is a village in ${v.tehsil} tehsil, ${v.district} district, ${v.state}, ${v.country}. As per Census ${v.census_year}, the total population is ${v.total_population} with a literacy rate of ${v.literates_total_percent}% and sex ratio of ${v.sex_ratio_percent} females per 1,000 males.`,
    url,
    geo: {
      "@type": "GeoCoordinates",
      latitude: v.latitude,
      longitude: v.longitude,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: v.village,
      addressRegion: v.state,
      postalCode: v.pin_code,
      addressCountry: "IN",
    },
    containedInPlace: [
      {
        "@type": ["Place", "AdministrativeArea"],
        name: v.tehsil,
        url: `${HOST}/${state_slug}/${district_slug}/${tehsil_slug}/`,
      },
      {
        "@type": ["Place", "AdministrativeArea"],
        name: v.district,
        url: `${HOST}/${state_slug}/${district_slug}/`,
      },
      {
        "@type": ["Place", "AdministrativeArea"],
        name: v.state,
        url: `${HOST}/${state_slug}/`,
      },
      {
        "@type": "Country",
        name: v.country,
        sameAs: "https://www.wikidata.org/wiki/Q668",
      },
    ],
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Total Population",
        value: v.total_population,
      },
      {
        "@type": "PropertyValue",
        name: "Sex Ratio",
        value: v.sex_ratio_percent,
        unitText: "females per 1000 males",
      },
      {
        "@type": "PropertyValue",
        name: "Literacy Rate",
        value: v.literates_total_percent,
        unitText: "percent",
      },
      {
        "@type": "PropertyValue",
        name: "Total Households",
        value: v.number_of_households,
      },
      { "@type": "PropertyValue", name: "PIN Code", value: v.pin_code },
      {
        "@type": "PropertyValue",
        name: "Main Occupation",
        value: v.main_occupation,
      },
      { "@type": "PropertyValue", name: "Nearest Town", value: v.nearest_town },
      {
        "@type": "PropertyValue",
        name: "Area",
        value: v.total_area_sq_km,
        unitText: "sq km",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dataset) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(place) }}
      />
    </>
  );
}
