import Link from "next/link";
import { getContent, getStates } from "@/utils/common";
import LordIcon from "@/components/LordIcon";
import { Metadata } from "next";
import HtmlContent from "@/components/htmlContent";
import dynamic from "next/dynamic";
import { HOST } from "@/lib/constants/constants";

const BlogSection = dynamic(() => import("@/components/BlogSection"));

const DEFAULT_METADATA = {
  title: "Village Info India | Explore States, Districts & Villages",
  description:
    "Explore detailed information about villages, tehsils, districts, and states across India. Census data, population stats, literacy rates, and more.",
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent("home");

  const title =
    !content?.error && content?.title ? content.title : DEFAULT_METADATA.title;

  const description =
    !content?.error && content?.description
      ? content.description
      : DEFAULT_METADATA.description;

  const image = content?.image || `${HOST}/images/default-share.jpg`;

  return {
    title,
    description,
    keywords: [
      "village info india",
      "india villages",
      "district info",
      "tehsil info",
      "india census data",
      "village population",
      "india states",
    ],
    openGraph: {
      title,
      description,
      url: "https://village.trendswe.com",
      siteName: "Village Info India",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: "https://village.trendswe.com",
    },
  };
}

export default async function Home() {
  const states = await getStates();
  const content = await getContent("home");
  return (
    <main className="mx-auto flex w-full flex-wrap p-4 md:max-w-275">
      {states.length === 0 ? (
        <p>No states found.</p>
      ) : (
        <>
          {content.top_content && (
            <HtmlContent type="top" content={content.top_content} />
          )}
          <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
            {states.map(
              (state: { _id: string; state_slug: string; state: string }) => (
                <Link
                  href={`/${state.state_slug}`}
                  key={state._id}
                  className="state-link flex items-center gap-4 rounded-lg border border-gray-300 p-4 transition hover:bg-gray-100"
                >
                  <LordIcon
                    src="/icons/mapPin.json"
                    trigger="loop-on-hover"
                    target=".state-link"
                    size={24}
                  />
                  {state.state}
                </Link>
              ),
            )}
          </div>
          {content?.blog_content?.length > 0 && (
            <BlogSection blogData={content?.blog_content} />
          )}
          {content.bottom_content && (
            <HtmlContent type="bottom" content={content.bottom_content} />
          )}
        </>
      )}
    </main>
  );
}
