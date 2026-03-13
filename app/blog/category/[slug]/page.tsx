import BlogBody from "@/components/blogBody";
import { HOST } from "@/lib/constants/constants";
import { getCategoryBySlug, getPostsByCategory } from "@/lib/wordpress";
import Pagination from "@/pagination";
import { Metadata } from "next";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
}: Pick<CategoryPageProps, "params">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };

  const title = `${category.name} | Blog`;
  const description =
    category.description ||
    `Browse all posts in the ${category.name} category.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${HOST}/blog/category/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${HOST}/blog/category/${slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const { posts, totalPages, categoryName } = await getPostsByCategory(
    slug,
    currentPage,
  );

  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:max-w-275">
      <h1 className="text-2xl font-bold">Category: {categoryName}</h1>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {posts?.map((item: any) => {
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
