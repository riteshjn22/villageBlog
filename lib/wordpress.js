const WP_API = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2`;

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

export async function getSiteInfo() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getBlogPageMeta() {
  const siteInfo = await getSiteInfo();
  if (!siteInfo) return null;

  const postsPageId = siteInfo?.page_for_posts;

  if (!postsPageId) {
    return {
      title: `Blog | ${siteInfo.name}`,
      description: siteInfo.description,
      ogImage: null,
    };
  }

  const res = await fetch(
    `${WP_API}/pages/${postsPageId}?_embed&_fields=id,title,excerpt,content,_links,_embedded`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) return null;
  const page = await res.json();

  return {
    title: page?.title?.rendered
      ? `${page.title.rendered} | ${siteInfo.name}`
      : `Blog | ${siteInfo.name}`,
    description:
      page?.excerpt?.rendered?.replace(/<[^>]*>/g, "").trim() ||
      page?.content?.rendered
        ?.replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, 160) ||
      siteInfo.description,
    ogImage: page?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
  };
}

export async function getBlogFrontPage() {
  const siteInfo = await getSiteInfo();

  // page_on_front is the static front page ID set under Settings → Reading
  const frontPageId = siteInfo?.page_on_front;
  if (!frontPageId) return null;

  const res = await fetch(
    `${WP_API}/pages/${frontPageId}?_embed&_fields=id,title,content,excerpt,_links,_embedded`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) return null;
  const page = await res.json();

  return {
    title: page?.title?.rendered ?? null,
    content: page?.content?.rendered ?? null,
    ogImage: page?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
  };
}

export async function getRightSidebarWidgets() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/custom/v1/right-widgets`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) return [];
  return res.json();
}

export async function getFooterWidgets() {
  try {
    const url = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/custom/v1/footer-widgets`;
    console.log("Fetching footer widgets from:", url); // ← check this in terminal

    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      console.error("Footer widgets fetch failed:", res.status, res.statusText);
      return [];
    }

    return res.json();
  } catch (err) {
    console.error("Footer widgets error:", err);
    return [];
  }
}

export async function getCategoryBySlug(slug) {
  const res = await fetch(`${WP_API}/categories?slug=${slug}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const categories = await res.json();
  return categories?.[0] ?? null;
}

export async function getPostsByCategory(categorySlug, page = 1) {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return { posts: [], totalPages: 0, categoryName: "" };

  const res = await fetch(
    `${WP_API}/posts?categories=${category.id}&per_page=20&page=${page}&_embed=wp:featuredmedia,author&_fields=id,title,slug,excerpt,date,_links,_embedded`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) return { posts: [], totalPages: 0, categoryName: category.name };

  const posts = await res.json();
  const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1");
  return { posts, totalPages, categoryName: category.name };
}
