import { getAllPosts, getAllPagesForSitemap } from "@/lib/wordpress";
import { HOST } from "@/lib/constants/constants";

const WP_API = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2`;

async function getAllCategories() {
  const res = await fetch(
    `${WP_API}/categories?per_page=100&_fields=id,slug,count`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) return [];
  const categories = await res.json();
  return (categories as any[]).filter((cat) => cat.count > 0);
}

export async function GET() {
  // ── Fetch all posts across all pages ──────────────────────────────
  let allPosts: any[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const { posts, totalPages: tp } = await getAllPosts(page, 100);
    allPosts = [...allPosts, ...posts];
    totalPages = tp;
    page++;
  } while (page <= totalPages);

  // ── Fetch categories and WP pages in parallel ──────────────────────
  const [categories, pages] = await Promise.all([
    getAllCategories(),
    getAllPagesForSitemap(),
  ]);

  // ── Post URLs ──────────────────────────────────────────────────────
  const postUrls = allPosts
    .map((post) => {
      const lastMod = post.modified ?? post.date;
      return `
  <url>
    <loc>${HOST}/blog/${post.slug}</loc>
    <lastmod>${new Date(lastMod).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join("");

  // ── WP Page URLs (about, contact, etc.) ───────────────────────────
  const pageUrls = (pages as any[])
    .map((p) => {
      const lastMod = p.modified ?? p.date;
      return `
  <url>
    <loc>${HOST}/blog/${p.slug}</loc>
    <lastmod>${new Date(lastMod).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    })
    .join("");

  // ── Category URLs ──────────────────────────────────────────────────
  const categoryUrls = (categories as any[])
    .map((cat) => {
      const catPages = Math.ceil(cat.count / 20);

      const mainCat = `
  <url>
    <loc>${HOST}/blog/category/${cat.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;

      const paginatedCatPages =
        catPages > 1
          ? Array.from({ length: catPages - 1 }, (_, i) => i + 2)
              .map(
                (p) => `
  <url>
    <loc>${HOST}/blog/category/${cat.slug}?page=${p}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`,
              )
              .join("")
          : "";

      return mainCat + paginatedCatPages;
    })
    .join("");

  // ── Paginated blog index pages ─────────────────────────────────────
  const blogPaginatedUrls =
    totalPages > 1
      ? Array.from({ length: totalPages - 1 }, (_, i) => i + 2)
          .map(
            (p) => `
  <url>
    <loc>${HOST}/blog?page=${p}</loc>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`,
          )
          .join("")
      : "";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Blog index -->
  <url>
    <loc>${HOST}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Paginated blog index -->
  ${blogPaginatedUrls}

  <!-- WP Pages (about, contact, etc.) -->
  ${pageUrls}

  <!-- Categories -->
  ${categoryUrls}

  <!-- Posts -->
  ${postUrls}

</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
