import { HOST, SITE_MAP_PER_PAGE } from "@/lib/constants/constants";
import { getVillages } from "@/utils/common";


// app/villages-sitemap.xml/route.ts
export async function GET() {
  const data = await getVillages(); // returns { totalVillages: 100 }
  const totalPages = Math.ceil(data?.totalVillages / SITE_MAP_PER_PAGE);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${Array.from({ length: totalPages }, (_, i) => `
  <sitemap>
    <loc>${HOST}/villages-sitemap/${i + 1}</loc>
  </sitemap>`).join("")}
</sitemapindex>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}