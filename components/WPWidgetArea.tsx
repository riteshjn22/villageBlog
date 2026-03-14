import Link from "next/link";
import { HOST } from "@/lib/constants/constants";

// ─── URL transformer ────────────────────────────────────────────────────────

function toLocalUrl(url: string | undefined): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const wpOrigin = process.env.NEXT_PUBLIC_WP_URL
      ? new URL(process.env.NEXT_PUBLIC_WP_URL).origin
      : null;
    if (wpOrigin && parsed.origin === wpOrigin) {
      return `${HOST}/blog${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    // relative URL or invalid — return as-is
  }
  return url;
}

// ─── Interfaces ─────────────────────────────────────────────────────────────

interface WidgetItem {
  id?: number;
  title?: string;
  name?: string;
  url: string;
  label?: string;
  count?: number;
  slug?: string;
  date?: string;
  thumbnail?: string;
  excerpt?: string;
  author?: string;
  post_title?: string;
}

interface WidgetRaw {
  title?: string;
  text?: string;
  filter?: boolean;
  visual?: boolean;
  content?: string;
  sortby?: string;
  exclude?: string;
  // media_image specific
  url?: string;
  attachment_id?: number;
  width?: number;
  height?: number;
  caption?: string;
  alt?: string;
  link_type?: string;
  link_url?: string;
  link_target_blank?: boolean;
  size?: string;
  [key: string]: unknown;
}

interface Widget {
  id: string;
  type: string;
  title?: string;
  content?: string;
  image_url?: string;
  alt?: string;
  link_url?: string;
  rss_url?: string;
  note?: string;
  filter?: boolean;
  raw?: WidgetRaw;
  items?: WidgetItem[];
}
interface WPWidgetAreaProps {
  sidebar: "footer" | "right" | "left";
  widgets: Widget[];
}

// ─── Individual widget renderers ────────────────────────────────────────────

function WidgetTitle({ title }: { title?: string }) {
  if (!title) return null;
  return (
    <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-500 uppercase">
      {title}
    </h3>
  );
}

function ItemList({ items }: { items: WidgetItem[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={item.id ?? i}>
          <Link
            href={toLocalUrl(item.url)}
            className="text-sm text-gray-700 hover:text-black hover:underline"
          >
            {item.title ?? item.name ?? item.label}
          </Link>
          {item.count !== undefined && (
            <span className="ml-1 text-xs text-gray-400">({item.count})</span>
          )}
        </li>
      ))}
    </ul>
  );
}

function RecentPostsList({ items }: { items: WidgetItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={item.id ?? i} className="flex gap-3">
          {item.thumbnail && (
            <img
              src={item.thumbnail}
              alt={item.title ?? ""}
              className="h-12 w-12 shrink-0 rounded object-cover"
            />
          )}
          <div>
            <Link
              href={toLocalUrl(item.url)}
              className="text-sm font-medium text-gray-800 hover:underline"
            >
              {item.title}
            </Link>
            {item.date && (
              <p className="text-xs text-gray-400">
                {new Date(item.date).toLocaleDateString()}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function RecentCommentsList({ items }: { items: WidgetItem[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={item.id ?? i}>
          <Link href={toLocalUrl(item.url)} className="text-sm hover:underline">
            <span className="font-medium">{item.author}</span>
            <span className="text-gray-500"> on {item.post_title}</span>
          </Link>
          {item.excerpt && (
            <p className="text-xs text-gray-400">{item.excerpt}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

function TagCloud({ items }: { items: WidgetItem[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((tag, i) => (
        <Link
          key={tag.id ?? i}
          href={toLocalUrl(tag.url)}
          className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:border-gray-400 hover:text-black"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}

function RssFeed({ widget }: { widget: Widget }) {
  return (
    <div>
      {widget.rss_url && (
        <p className="mb-2 text-xs break-all text-gray-400">{widget.rss_url}</p>
      )}
      {widget.items && widget.items.length > 0 && (
        <ul className="space-y-2">
          {widget.items.map((item, i) => (
            <li key={i}>
              {/* RSS items point to external URLs — no toLocalUrl */}
              <Link
                href={item.url}
                className="text-sm text-gray-700 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.title}
              </Link>
              {item.date && (
                <p className="text-xs text-gray-400">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ImageWidget({ widget }: { widget: Widget }) {
  if (!widget?.raw?.url) return null;
  const img = (
    <img
      src={widget?.raw?.url}
      alt={widget?.raw?.alt ?? ""}
      className="w-full rounded"
    />
  );
  return widget?.raw?.link_url ? (
    <Link href={toLocalUrl(widget?.raw?.link_url)} target="_blank">
      {img}
    </Link>
  ) : (
    img
  );
}

function VideoWidget({ widget }: { widget: Widget }) {
  if (!widget.rss_url && !widget.content) return null;
  return (
    <video controls className="w-full rounded">
      <source src={widget.rss_url ?? ""} />
    </video>
  );
}

function BlockWidget({ widget }: { widget: Widget }) {
  if (!widget?.raw?.content) return null;
  return (
    <div
      className="prose prose-sm max-w-none text-gray-700"
      dangerouslySetInnerHTML={{ __html: widget.raw.content }}
    />
  );
}

// ─── Single widget dispatcher ────────────────────────────────────────────────

function WPWidget({ widget }: { widget: Widget }) {
  const renderBody = () => {
    // HTML content (text / custom_html)
    if (widget.content) {
      return (
        <div
          className="prose prose-sm max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: widget.content }}
        />
      );
    }

    // Items-based widgets
    if (widget.items && widget.items.length > 0) {
      switch (widget.type) {
        case "recent-posts":
        case "ct_mission_news_post_list":
          return <RecentPostsList items={widget.items} />;
        case "recent-comments":
          return <RecentCommentsList items={widget.items} />;
        case "tag_cloud":
          return <TagCloud items={widget.items} />;
        default:
          return <ItemList items={widget.items} />;
      }
    }

    // Type-specific fallbacks
    switch (widget.type) {
      case "media_image":
        return <ImageWidget widget={widget} />;
      case "video":
      case "audio":
        return <VideoWidget widget={widget} />;
      case "rss":
        return <RssFeed widget={widget} />;
      case "block":
        return <BlockWidget widget={widget} />;

      case "search":
        return (
          <form action="/search" className="flex gap-2">
            <input
              type="search"
              name="q"
              placeholder="Search..."
              className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-gray-400"
            />
            <button
              type="submit"
              className="rounded bg-black px-3 py-1.5 text-sm text-white"
            >
              Go
            </button>
          </form>
        );
      case "calendar":
      case "meta":
        return (
          <p className="text-xs text-gray-400">{widget.note ?? widget.type}</p>
        );
      default:
        return null;
    }
  };

  const body = renderBody();
  if (!body) return null;

  return (
    <div className="widget">
      <WidgetTitle title={widget.title} />
      {body}
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function WPWidgetArea({ sidebar, widgets }: WPWidgetAreaProps) {
  if (!widgets?.length) return null;

  const isFooter = sidebar === "footer";

  return (
    <div className="flex w-full bg-gray-100 p-4">
      <div
        className={
          isFooter
            ? "mx-auto flex w-full flex-wrap p-4 md:max-w-275"
            : "flex w-full"
        }
      >
        <div
          id={`${sidebar}_sidebar`}
          className={
            isFooter
              ? "grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              : "flex w-full flex-col gap-4"
          }
        >
          {widgets.map((widget) => (
            <WPWidget key={widget.id} widget={widget} />
          ))}
        </div>
      </div>
    </div>
  );
}
