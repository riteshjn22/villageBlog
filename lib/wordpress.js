const WP_API = "https://blog.trendswe.com/wp-json/wp/v2";

// ✅ All posts (auto-paginated, max 100 per request)
export async function getAllPosts() {
  let allPosts = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `${WP_API}/posts?per_page=10&page=${page}&_embed=wp:featuredmedia,author&_fields=id,title,slug,excerpt,date,_links,_embedded`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) break;
    const posts = await res.json();
    if (posts.length === 0) break;
    allPosts = [...allPosts, ...posts];
    page++;
  }
  return allPosts;
}

// ✅ Single post by slug
export async function getPostBySlug(slug) {
  const res = await fetch(
    `${WP_API}/posts?slug=${slug}
     &_fields=id,title,slug,content,excerpt,date,fimg_url`,
    { next: { revalidate: 3600 } },
  );
  const [post] = await res.json();
  return post || null;
}

// ✅ All WP pages (About, Contact, Privacy, etc.)
export async function getAllPages() {
  const res = await fetch(
    `${WP_API}/pages?per_page=100
     &_fields=id,title,slug,content,excerpt,date`,
    { next: { revalidate: 3600 } },
  );
  const pages = await res.json();
  return pages || [];
}

// ✅ Single WP page by slug
export async function getPageBySlug(slug) {
  const res = await fetch(
    `${WP_API}/pages?slug=${slug}
     &_fields=id,title,slug,content,date`,
    { next: { revalidate: 3600 } },
  );
  const [page] = await res.json();
  return page || null;
}
