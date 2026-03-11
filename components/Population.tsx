type BasicItem = {
  label: string;
  value?: string | number | null;
};

type NestedItem = {
  label: string;
  value?: BasicItem[]; // for SC/ST nested structure
};

type PopulationProps = {
  heading: string;
  year: string | number;
  overAllPopulation?: BasicItem[];
  childrenPopulation?: BasicItem[];
  scStPopulation?: NestedItem[];
};

export default function Population({
  heading,
  year,
  overAllPopulation,
  childrenPopulation,
  scStPopulation,
}: PopulationProps) {
  return (
    <div className="mt-8 flex w-full flex-col">
      <div className="mb-2.5 flex items-center justify-between gap-4">
        <h2 className="flex w-fit text-lg font-bold md:text-2xl md:whitespace-nowrap">
          Population of {heading} - (Census {year})
        </h2>
        <span className="hidden h-px w-full bg-[#e2e8f0] md:flex" />
      </div>

      <div className="flex w-full flex-wrap gap-4">
        {/* Overall Population */}
        <div className="flex w-full flex-wrap overflow-hidden rounded-lg border border-gray-200">
          <div className="w-full border-b border-b-gray-200 bg-[#f8fafc] p-3 text-sm tracking-[0.08em] text-[#64748b] uppercase">
            Total Population by Gender
          </div>

          <div className="flex w-full flex-wrap">
            {(() => {
              const normalItems = overAllPopulation?.filter(
                (item) => item.label !== "Sex Ratio",
              );

              return overAllPopulation?.map((item, index) => {
                if (item.label !== "Sex Ratio") {
                  const normalIndex = normalItems?.findIndex(
                    (i) => i.label === item.label,
                  );
                  const isLastNormal =
                    normalIndex === (normalItems?.length ?? 0) - 1;

                  return (
                    <div
                      key={index}
                      className={`flex w-1/3 flex-col gap-2 border-r border-gray-200 p-4 text-center ${
                        isLastNormal ? "border-r-0" : ""
                      }`}
                    >
                      <div className="w-full text-xs text-[#64748b] uppercase">
                        {item.label}
                      </div>
                      <div className="w-full text-sm font-bold">
                        {item.value ?? "-"}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={index}
                    className="flex w-full border-t border-gray-200"
                  >
                    <div className="w-1/2 bg-[#f8fafc] p-3 text-sm text-[#64748b] capitalize">
                      {item.label}
                    </div>
                    <div className="flex w-1/2 flex-wrap gap-2 p-3 text-sm font-bold text-[#0f172a] capitalize">
                      {item.value != null
                        ? Number.isInteger(Number(item.value))
                          ? item.value
                          : parseFloat(String(item.value)).toFixed(2)
                        : "-"}
                      %
                      <span className="text-xs font-light text-[#64748b]">
                        females per 1,000 males
                      </span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Children + SC/ST */}
        <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
          {/* Children Population */}
          <div className="flex w-full flex-wrap overflow-hidden rounded-lg border border-gray-200 md:w-1/2">
            <div className="w-full border-b border-b-gray-200 bg-[#f8fafc] p-3 text-sm tracking-[0.08em] text-[#64748b] uppercase">
              Children Population (Age 0-6 Years)
            </div>

            <table className="w-full">
              <tbody>
                {childrenPopulation?.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-b-gray-200 text-sm last:border-b-0"
                  >
                    <td className="w-1/2 bg-[#f8fafc] p-4 font-medium text-[#475569]">
                      {item.label}
                    </td>
                    <td className="p-4 font-bold text-[#0f172a]">
                      {item.value ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SC/ST Population */}
          <div className="flex w-full flex-wrap overflow-hidden rounded-lg border border-gray-200 md:w-1/2">
            <div className="w-full border-b border-b-gray-200 bg-[#f8fafc] p-3 text-sm tracking-[0.08em] text-[#64748b] uppercase">
              Scheduled Caste & Scheduled Tribe
            </div>

            <table className="w-full">
              <tbody>
                <tr>
                  {scStPopulation?.map((section, index) => (
                    <td className="w-1/2 p-3" key={index}>
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td
                              colSpan={2}
                              className="pb-2 text-xs font-bold text-[#2563eb]"
                            >
                              {section.label}
                            </td>
                          </tr>

                          {section.value?.map((item, subIndex) => (
                            <tr
                              key={subIndex}
                              className="border-b border-b-gray-200 last:border-b-0"
                            >
                              <td className="py-2 text-xs text-[#64748b]">
                                {item.label}
                              </td>
                              <td className="py-2 text-xs font-bold text-[#0f172a]">
                                {item.value != null
                                  ? Number.isInteger(Number(item.value))
                                    ? String(item.value)
                                    : parseFloat(String(item.value)).toFixed(2)
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
