type Props = {
  type: string;
  name: string;
};

export default function About({ type, name }: Props) {
  return (
    <div className="w-full p-4 bg-[#fffbeb] rounded-xl border border-gray-200 border-l-4 border-l-amber-500">
      <h3 className="mb-2.5 text-[#0f172a] font-bold">ℹ️ About This Data</h3>
      <p className="text-sm text-[#64748b]">
        Population figures cover all persons usually residing in {name} {type}.
        Literacy rate includes persons aged 7+ who can read and write. Sex ratio
        = females per 1,000 males. Worker participation rate = workers as % of
        total population.
      </p>
    </div>
  );
}
