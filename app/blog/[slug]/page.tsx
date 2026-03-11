import { getAllPosts, getPostBySlug } from "@/lib/wordpress";
import Image from "next/image";
import { notFound } from "next/navigation";

// Pre-render ALL slugs at build time (SEO)
export async function generateStaticParams() {
  const [posts] = await Promise.all([getAllPosts()]);

  return [...(posts ?? [])].map((item) => ({
    slug: item.slug,
  }));
}

export default async function SingleBlog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Try post first, fall back to WP page
  const content = await getPostBySlug(slug);

  //   console.log(content, "content");

  if (!content) notFound();
  return (
    <article
      className="mx-auto flex w-full flex-wrap p-4 md:max-w-275"
      id="single"
    >
      <div className="flex w-full flex-col gap-4 md:w-2/3">
        <div className="relative aspect-video w-full">
          <Image
            src={content?.fimg_url}
            alt={content.title.rendered}
            fill
            className="object-cover"
          />
        </div>

        <h1 className="text-[28px]">{content.title.rendered}</h1>
        <div dangerouslySetInnerHTML={{ __html: content.content.rendered }} />
      </div>
    </article>
  );
}
