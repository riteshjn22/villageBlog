import BlogBody from "@/components/blogBody";
import { getAllPosts } from "@/lib/wordpress";
import Pagination from "@/pagination";
import Link from "next/link";

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

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
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
