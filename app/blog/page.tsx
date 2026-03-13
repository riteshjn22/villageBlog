import { Metadata } from "next";
import BlogBody from "@/components/blogBody";
import {
  getAllPosts,
  getBlogPageMeta,
  getBlogFrontPage,
} from "@/lib/wordpress";
import Pagination from "@/pagination";
import { HOST } from "@/lib/constants/constants";

interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string }[];
    author?: { name: string }[];
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getBlogPageMeta();

  return {
    title: meta?.title,
    description: meta?.description,
    openGraph: {
      title: meta?.title,
      description: meta?.description,
      type: "website",
      url: `${HOST}/blog`,
      ...(meta?.ogImage && { images: [{ url: meta.ogImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: meta?.title,
      description: meta?.description,
    },
    alternates: {
      canonical: `${HOST}/blog`,
    },
  };
}

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const frontPage = await getBlogFrontPage();

  // If WP has a Posts page set under Settings → Reading, render its content
  if (frontPage) {
    return (
      <main className="mx-auto flex w-full flex-col gap-6 p-4 md:max-w-275">
        {frontPage.title && (
          <h1
            className="text-3xl font-bold"
            dangerouslySetInnerHTML={{ __html: frontPage.title }}
          />
        )}
        {frontPage.content && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: frontPage.content }}
          />
        )}
      </main>
    );
  }

  // Otherwise fall back to paginated posts list
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const { posts, totalPages } = await getAllPosts(currentPage);

  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:max-w-275">
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {posts?.map((item: WPPost) => {
          const itemBlogData = {
            url: `/blog/${item?.slug}`,
            imageUrl: item?._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
            title: item?.title?.rendered,
            short_description: item?.excerpt?.rendered
              .replace(/<[^>]*>/g, "")
              .trim(),
            author: item?._embedded?.author?.[0]?.name,
            date: item?.date,
          };
          return <BlogBody item={itemBlogData} key={item?.id} />;
        })}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </main>
  );
}
