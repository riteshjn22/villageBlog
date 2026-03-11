import Image from "next/image";
import Link from "next/link";
import BlogBody from "./blogBody";

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
          return <BlogBody key={index} item={item} />;
        })}
      </div>
    </div>
  );
}
