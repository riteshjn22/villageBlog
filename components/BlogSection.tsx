import Image from "next/image";
import Link from "next/link";

type BlogItem = {
  url: string;
  imageUrl: string;
  title: string;
  short_description: string;
};

export default function BlogSection({ blogData }: { blogData: BlogItem[] }) {
  return (
    <div className="mt-4 w-full">
      <h2 className="mb-4 text-base font-medium">Blogs</h2>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {blogData?.map((item, index) => {
          return (
            <Link
              href={item?.url}
              key={index}
              className="flex items-center overflow-hidden rounded-lg border border-gray-300 transition hover:bg-gray-100"
            >
              {item?.imageUrl && (
                <div className="relative h-full w-1/3">
                  <Image
                    src={item?.imageUrl}
                    alt={item?.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div
                className={`flex ${item?.imageUrl ? "w-2/3" : "w-full"} flex-col gap-4 p-4`}
              >
                <p className="w-full truncate text-sm font-medium">
                  {item?.title}
                </p>
                <p className="line-clamp-2 text-sm">
                  {item?.short_description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
