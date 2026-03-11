import BlogBody from "@/components/blogBody";
import { getAllPosts } from "@/lib/wordpress";

export default async function Blog() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto flex w-full flex-wrap p-4 md:max-w-275">
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {posts?.map((item) => {
          const itemBlogData = {
            url: `/blog/${item?.slug}`,
            imageUrl: item?._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
            title: item?.title?.rendered,
            short_description: item?.excerpt?.rendered,
            author: item?._embedded?.author[0]?.name,
            date: item?.date,
          };
          return <BlogBody item={itemBlogData} key={item?.id} />;
        })}
      </div>
    </main>
  );
}
