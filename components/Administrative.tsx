type AdministrativeItem = {
  label: string;
  value?: string | number | null;
};

type AdministrativeProps = {
  heading: string;
  data?: AdministrativeItem[];
};

export default function Administrative({ heading, data }: AdministrativeProps) {
  return (
    <div className="flex w-full mt-8 flex-col">
      <div className="flex gap-4 mb-2.5 items-center justify-between">
        <h2 className="text-lg md:text-2xl font-bold flex w-fit md:whitespace-nowrap">
          Administrative Overview of {heading}
        </h2>
        <span className="md:flex hidden h-px bg-[#e2e8f0] w-full" />
      </div>

      <div className="flex w-full border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <tbody>
            {data?.map((item, index) => (
              <tr className="border-b border-gray-200" key={index}>
                <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] capitalize text-[#475569]">
                  {item.label}
                </td>
                <td className="p-3 text-sm capitalize text-[#0f172a] font-bold">
                  {item.value ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
