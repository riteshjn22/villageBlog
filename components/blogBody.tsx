import Image from "next/image";
import Link from "next/link";

interface BlogItem {
  url: string;
  imageUrl?: string;
  title: string;
  author?: string;
  date?: string;
  short_description?: string;
}

export default function BlogBody({ item }: { item: BlogItem }) {
  return (
    <Link
      href={item?.url}
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
        <div>
          <p className="w-full truncate text-sm font-medium">{item?.title}</p>
          <p className="flex w-full gap-4 truncate text-xs font-medium text-blue-700">
            {item?.author && <span>{`Author : ${item?.author}`}</span>}
            {item?.date && <span>{`Published : ${item?.date}`}</span>}
          </p>
        </div>

        <p className="line-clamp-2 text-sm">{item?.short_description}</p>
      </div>
    </Link>
  );
}
