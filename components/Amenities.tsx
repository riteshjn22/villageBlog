type AmenityItem = {
  icon: React.ReactNode;
  name: string;
  value: number | string;
};

type AmenitiesProps = {
  heading: string;
  data: AmenityItem[];
};

export default function Amenities({ heading, data }: AmenitiesProps) {
  return (
    <div className="flex w-full mt-8 flex-col">
      <div className="flex gap-4 mb-2.5 items-center justify-between">
        <h2 className="text-lg md:text-2xl font-bold flex w-fit md:whitespace-nowrap">
          No. of Amenities & Facilities in {heading}
        </h2>
        <span className="md:flex hidden h-px bg-[#e2e8f0] w-full" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {data?.map((item, index) => (
          <div
            key={index}
            className="p-4 flex border border-gray-200 shadow-[0_6px_18px_rgba(15,23,42,0.05)] rounded-xl gap-4 flex-col items-center justify-center"
          >
            <div className="flex w-full text-3xl items-center justify-center">
              {item.icon}
            </div>

            <div className="w-full uppercase text-xs text-[#64748b] font-bold tracking-wider text-center">
              {item.name}
            </div>

            <div className="w-full uppercase text-sm text-[#64748b] font-bold tracking-wider text-center">
              {item.value || 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
