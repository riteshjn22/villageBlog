type DataItem = {
  label: string;
  value?: string | number | null;
};

type TopLeftProps = {
  title: string;
  subHeading?: string | null;
  data?: DataItem[];
};

export default function TopLeft({ title, subHeading, data }: TopLeftProps) {
  return (
    <div className="flex w-full min-w-52.5 shrink-0 flex-col gap-1 rounded-[14px] border border-[#c7d7fb] bg-[#eff6ff] p-4 md:w-1/3">
      <p className="mb-1.5 text-[11px] font-bold tracking-[0.08em] text-[#1b4ea1] uppercase">
        {title}
      </p>
      <p className={`mb-2.5 text-[19px] leading-[1.2] text-[#1e3a8a]`}>
        {subHeading}
      </p>
      {data?.map((item, index) => (
        <p
          className="flex justify-between gap-2 border-b border-[#dbeafe] py-1.25 text-[13px]"
          key={index}
        >
          <span className="w-1/3 text-[#4b6fa5]">{item.label}</span>
          <strong className="truncate text-right text-[#1e3a8a]">
            {item?.value ?? "-"}
          </strong>
        </p>
      ))}
    </div>
  );
}
