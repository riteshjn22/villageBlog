type LiteracyItem = {
  label: string;
  value?: string | number | null;
  percent?: string | number | null;
};

type LiteracyProps = {
  heading: string;
  data?: LiteracyItem[];
};

export default function Literacy({ heading, data }: LiteracyProps) {
  const formatPercent = (val?: string | number | null) => {
    if (val === null || val === undefined) return "-";
    const num = typeof val === "number" ? val : Number(val);
    return isNaN(num) ? "-" : num.toFixed(2);
  };

  return (
    <div className="flex w-full mt-8 flex-col">
      <div className="flex gap-4 mb-2.5 items-center justify-between">
        <h2 className="text-lg md:text-2xl font-bold flex w-fit md:whitespace-nowrap">
          Literacy Rate in {heading}
        </h2>
        <span className="md:flex hidden h-px bg-[#e2e8f0] w-full" />
      </div>

      <div className="flex w-full flex-wrap rounded-lg overflow-hidden border border-gray-200">
        <div className="w-full uppercase text-[#64748b] text-sm tracking-[0.08em] p-3 bg-[#f8fafc] border-b border-gray-200">
          Literate Population & Literacy Rate by Gender
        </div>

        <div className="flex w-full flex-wrap">
          {data?.map((item, index) => {
            const isLast = index === (data.length ?? 0) - 1;

            return (
              <div
                key={index}
                className={`w-1/3 flex p-4 flex-col gap-2 text-center border-r border-gray-200 ${
                  isLast ? "border-r-0" : ""
                }`}
              >
                <div className="w-full text-xs text-[#64748b] uppercase">
                  {item.label}
                </div>

                <div className="w-full text-sm font-bold">
                  {item.value ?? "-"}
                </div>

                <div className="w-full text-xs font-bold text-[#2563eb]">
                  {formatPercent(item.percent)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
