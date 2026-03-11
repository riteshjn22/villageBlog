export const REVALIDATE_TIME = 60 * 10; // 1 hour in seconds
export const HOST =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://village.trendswe.com";
export const SITE_MAP_PER_PAGE = 10000;
export const SITE_NAME = "Village Trends";
