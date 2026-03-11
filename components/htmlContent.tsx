// components/HtmlContent.tsx

type HtmlContentProps = {
  type: "top" | "bottom";
  content: string;
  customClass?: string;
};

export default function HtmlContent({
  type,
  content,
  customClass = "",
}: HtmlContentProps) {
  return (
    <div
      className={`${type === "top" ? "mb-4" : "mt-4"} w-full ${customClass}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
