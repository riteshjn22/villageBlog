type MapProps = {
  heading: string;
  lat: number | string;
  long: number | string;
  nearest_town: string;
};

export default function Map({ heading, lat, long, nearest_town }: MapProps) {
  return (
    <div className="flex w-full mt-8 flex-col">
      <div className="flex gap-4 mb-2.5 items-center justify-between">
        <h2 className="text-lg md:text-2xl font-bold flex w-fit md:whitespace-nowrap">
          Location of {heading} on Map
        </h2>
        <span className="md:flex hidden h-px bg-[#e2e8f0] w-full" />
      </div>

      <div className="flex w-full border border-gray-200 rounded-lg overflow-hidden flex-col">
        <iframe
          title={heading}
          loading="lazy"
          width="100%"
          height="220"
          src={`https://www.google.com/maps?q=${lat},${long}&z=13&output=embed`}
        ></iframe>

        <div className="w-full flex items-center justify-between p-2 text-xs bg-[#f8fafc] text-[#64748b]">
          <span className="flex gap-1">
            Lat: <strong className="text-[#0f172a]">{lat}</strong>
          </span>

          <span className="flex gap-1">
            Long: <strong className="text-[#0f172a]">{long}</strong>
          </span>

          <span className="flex gap-1">
            Nearest Town:
            <strong className="text-[#0f172a]">{nearest_town}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
