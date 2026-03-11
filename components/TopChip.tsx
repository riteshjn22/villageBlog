type TopChipProps = {
  heading: string;
  value?: string | number | null;
  isShowPercent?: boolean;
};

export default function TopChip({
  heading,
  value,
  isShowPercent,
}: TopChipProps) {
  const displayValue =
    typeof value === "number" && !Number.isInteger(value)
      ? `${parseFloat(value.toFixed(2))}${isShowPercent ? "%" : ""}`
      : value;

  return (
    <div className="flex w-full md:w-1/3 gap-1 flex-col border border-gray-200 rounded-xl bg-linear-to-b from-slate-50 to-white p-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
      <p className="text-[11px] font-semibold tracking-[0.05em] uppercase text-[#64748b] mb-1.25">
        {heading}
      </p>
      <p className="text-[17px] font-bold text-[#0f172a] leading-[1.2]">
        {displayValue ?? "-"}
      </p>
    </div>
  );
}
