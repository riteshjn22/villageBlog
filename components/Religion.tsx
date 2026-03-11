type ReligionItem = {
  label: string;
  value?: string | number | null;
  percent?: string | number | null;
};

type ReligionProps = {
  heading: string;
  religionData?: ReligionItem[];
};

export default function Religion({ heading, religionData }: ReligionProps) {
  const religionColor: Record<string, string> = {
    hindu: "bg-gradient-to-r from-[#f97316] to-[#fb923c]",
    muslim: "bg-gradient-to-r from-[#10b981] to-[#34d399]",
    sikh: "bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]",
    christian: "bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]",
    jain: "bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa]",
    buddhist: "bg-gradient-to-r from-[#ec4899] to-[#f472b6]",
  };

  const formatPercent = (val?: string | number | null) => {
    if (val === null || val === undefined) return "-";
    const num = typeof val === "number" ? val : Number(val);
    return isNaN(num) ? "-" : num.toFixed(2);
  };

  return (
    <div className="flex w-full mt-8 flex-col">
      <div className="flex gap-4 mb-2.5 items-center justify-between">
        <h2 className="text-lg md:text-2xl font-bold flex w-fit md:whitespace-nowrap">
          Religion Population in {heading}
        </h2>
        <span className="md:flex hidden h-px bg-[#e2e8f0] w-full" />
      </div>

      <div className="w-full flex border border-gray-200 overflow-hidden rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f8fafc] uppercase text-left">
              <th className="p-3 text-[#64748b] text-xs">Religion</th>
              <th className="p-3 text-[#64748b] text-xs w-1/2">
                Population Share
              </th>
              <th className="p-3 text-[#64748b] text-xs">Population %</th>
            </tr>
          </thead>

          <tbody>
            {religionData?.map((item, index) => {
              const key = item?.label?.toLowerCase();
              const gradient =
                key && religionColor[key] ? religionColor[key] : "";

              return (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-3 py-5 text-[#64748b] text-xs font-bold">
                    {item.label}
                  </td>

                  <td className="px-3 py-5 text-[#64748b] text-xs">
                    <div className={`w-full h-1.5 rounded-lg ${gradient}`} />
                  </td>

                  <td className="px-3 py-5 text-[#64748b] text-xs">
                    <span className="font-bold">{item.value ?? "-"}</span>{" "}
                    {formatPercent(item.percent)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
