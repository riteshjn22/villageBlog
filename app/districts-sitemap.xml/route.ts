import { HOST } from "@/lib/constants/constants";
import { getDistricts, getStates } from "@/utils/common";
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const states = await getStates();

  const districtsByState = await Promise.all(
    states.map((s: { state_slug: string }) =>
      getDistricts({ state_slug: s.state_slug }),
    ),
  );
  const districts = districtsByState.flat();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${districts
  .map(
    (d: { state_slug: string; district_slug: string }) => `  <url>
    <loc>${HOST}/${d.state_slug}/${d.district_slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
