import Link from "next/link";

type ListItem = {
  name: string;
  redirectionUrl: string;
};

type Props = {
  heading: string;
  listData: ListItem[];
};

export default function PopularList({ heading, listData }: Props) {
  return (
    <div className="flex w-full flex-col border border-gray-200 p-4 rounded-xl shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
      <h3 className="text-[#0f172a] font-bold">{heading}</h3>
      <ul className="flex flex-col mt-4">
        {listData?.map((item) => (
          <li
            key={item.redirectionUrl}
            className="flex w-full border-b border-b-gray-200 last:border-0"
          >
            <Link
              href={item.redirectionUrl}
              className="flex w-full py-2 text-[#2563eb] leading-normal"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
