import { HOST } from "@/lib/constants/constants";
import { getVillages } from "@/utils/common";



export async function GET(
  _req: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page: pageParam } = await params; // ← await params
  const page = parseInt(pageParam) - 1;

  const villages = await getVillages({ pageIndex: page });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${villages.map((v: any) => `
  <url>
    <loc>${HOST}/${v.state_slug}/${v.district_slug}/${v.tehsil_slug}/${v.village_slug}</loc>
    <lastmod>${new Date(v.updatedAt).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join("")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}

