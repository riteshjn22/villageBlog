import WPWidgetArea from "@/components/WPWidgetArea";
import { HOST, SITE_NAME } from "@/lib/constants/constants";
import {
  getAllPosts,
  getAllPages,
  getPostBySlug,
  getPageBySlug,
  // getRightSidebarWidgets,
} from "@/lib/wordpress";
import { formatDate } from "@/utils/common";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = (await getPostBySlug(slug)) || (await getPageBySlug(slug));

  if (!content) return {};

  const tags =
    content._embedded?.["wp:term"]?.[1]?.map((t: { name: string }) => t.name) ??
    [];
  const categories =
    content._embedded?.["wp:term"]?.[0]?.map((c: { name: string }) => c.name) ??
    [];

  const keywords = [
    ...categories,
    ...tags,
    "village info india",
    "india villages",
    "district info",
    "tehsil info",
  ];

  const title = content.title.rendered;
  const description = content.excerpt.rendered.replace(/<[^>]*>/g, "").trim();
  const image = content.fimg_url || `${HOST}/images/default-share.jpg`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://village.trendswe.com/blog/${slug}`,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: { canonical: `https://village.trendswe.com/blog/${slug}` },
  };
}

// Pre-render both posts and pages at build time
export async function generateStaticParams() {
  const [{ posts }, pages] = await Promise.all([
    getAllPosts(1, 100),
    getAllPages(),
  ]);
  return [...(posts ?? []), ...(pages ?? [])].map((item) => ({
    slug: item.slug,
  }));
}

export default async function SingleBlog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  const page = post ? null : await getPageBySlug(slug);
  const content = post || page;

  // const rightWidgets = await getRightSidebarWidgets();

  if (!content) notFound();

  const author = content?._embedded?.author?.[0]?.name;

  return (
    <article
      className="mx-auto flex w-full flex-wrap gap-4 p-4 md:max-w-275 md:flex-nowrap"
      id="single"
    >
      <div className="flex w-full flex-col gap-4 md:w-2/3">
        {content?.fimg_url && (
          <div className="relative aspect-video w-full">
            <Image
              src={content.fimg_url}
              alt={content.title.rendered}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex w-full flex-col">
          <h1 className="text-[28px]">{content.title.rendered}</h1>
          <p
            className="m-0 flex w-full gap-4 truncate text-xs font-medium text-gray-400"
            id="authorSec"
          >
            {author && (
              <span className="capitalize">{`Author : ${author}`}</span>
            )}
            {content?.date && (
              <span>{`Published : ${formatDate(content.date)}`}</span>
            )}
          </p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: content.content.rendered }} />
      </div>
      <div className="sticky top-18 flex w-full self-start md:w-1/3">
        {/* <WPWidgetArea sidebar="right" widgets={rightWidgets} /> */}
      </div>
    </article>
  );
}
