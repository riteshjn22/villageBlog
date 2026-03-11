import Link from "next/link";

type ListType = "state" | "district" | "tehsil";

type ListItem = {
  name: string;
  population: number | null;
  total: number | null;
  sex_ratio: string | number;
  literacy_rate: string | number;
  state_slug?: string;
  district_slug?: string;
  tehsil_slug?: string;
  village_slug?: string;
};

type Props = {
  type: ListType;
  heading: string;
  data: ListItem[];
};

const TYPE_CONFIG: Record<ListType, { listType: string; total: string }> = {
  state: { listType: "Districts", total: "Total Tehsils" },
  district: { listType: "Tehsils", total: "Total Villages" },
  tehsil: { listType: "Villages", total: "Households" },
};

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="p-3 text-xs text-[#64748b]">{children}</th>
);

const TD = ({ children }: { children: React.ReactNode }) => (
  <td className="p-3 text-xs text-[#64748b]">{children ?? "—"}</td>
);

export default function List({ type, heading, data }: Props) {
  const { listType, total } = TYPE_CONFIG[type];

  return (
    <div className="mt-8 flex w-full flex-col">
      <div className="mb-2.5 flex items-center justify-between gap-4">
        <h2 className="flex w-fit text-lg font-bold md:text-2xl md:whitespace-nowrap">
          {listType} List in {heading}
        </h2>
        <span className="hidden h-px w-full bg-[#e2e8f0] md:flex" />
      </div>

      <div className="flex w-full overflow-auto rounded-lg border border-gray-200 md:overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f8fafc] text-left uppercase">
              <TH>#</TH>
              <TH>{listType} Name</TH>
              <TH>Population</TH>
              <TH>{total}</TH>
              <TH>Sex Ratio</TH>
              <TH>Literacy Rate</TH>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr className="text-left" key={item.name}>
                <TD>{index + 1}</TD>
                <TD>
                  <Link
                    className="text-[#2563eb]"
                    href={`/${[item?.state_slug, item?.district_slug, item?.tehsil_slug, item?.village_slug].filter(Boolean).join("/")}`}
                  >
                    {item.name}
                  </Link>
                </TD>
                <TD>{item.population}</TD>
                <TD>{item.total}</TD>
                <TD>{item.sex_ratio}</TD>
                <TD>{item.literacy_rate}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
