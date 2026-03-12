const WP_API = "https://blog.trendswe.com/wp-json/wp/v2";

export async function getAllPosts(page = 1, perPage = 20) {
  const res = await fetch(
    `${WP_API}/posts?per_page=${perPage}&page=${page}&_embed=wp:featuredmedia,author&_fields=id,title,slug,excerpt,date,_links,_embedded`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) return { posts: [], totalPages: 0 };
  const posts = await res.json();
  const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1");
  return { posts, totalPages };
}

export async function getPostBySlug(slug) {
  const res = await fetch(
    `${WP_API}/posts?slug=${slug}&_embed=wp:featuredmedia,author,wp:term&_fields=id,title,slug,content,excerpt,date,fimg_url,_links,_embedded`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) return null;
  const [post] = await res.json();
  return post || null;
}

export async function getAllPages() {
  const res = await fetch(
    `${WP_API}/pages?per_page=100&_embed=wp:featuredmedia,author,wp:term&_fields=id,title,slug,content,excerpt,date,_links,_embedded`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) return [];
  const pages = await res.json();
  return Array.isArray(pages) ? pages : [];
}

export async function getPageBySlug(slug) {
  const res = await fetch(
    `${WP_API}/pages?slug=${slug}&_embed=wp:featuredmedia,author,wp:term&_fields=id,title,slug,content,excerpt,date,_links,_embedded`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) return null;
  const [page] = await res.json();
  if (!page) return null;
  return {
    ...page,
    fimg_url: page._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
  };
}
