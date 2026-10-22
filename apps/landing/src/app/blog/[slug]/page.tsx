import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import RichText from "../components/RichText";
import PostCard from "../components/PostCard";
import { C, HERO_GRADIENT } from "../components/theme";
import {
  BLOG_POSTS,
  SITE_URL,
  formatDate,
  getPost,
  sortedPosts,
  type Block,
} from "../posts";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLOG_POSTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found | Zoiko Social" };

  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.metaTitle,
      description: post.metaDescription,
      publishedTime: post.datePublished,
      authors: [post.author],
      images: [{ url: `${SITE_URL}${post.cover.src}`, alt: post.cover.alt }],
    },
  };
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={i}
          id={block.id}
          className="scroll-mt-24 pt-6 text-[22px] font-extrabold leading-[30px] sm:text-[26px] sm:leading-[34px]"
          style={{ color: C.ink }}
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={i} className="pt-2 text-lg font-bold leading-7" style={{ color: C.brand }}>
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p key={i}>
          <RichText text={block.text} />
        </p>
      );
    case "ul":
    case "ol": {
      const List = block.type;
      return (
        <List
          key={i}
          className={`flex flex-col gap-2 pl-6 ${
            block.type === "ul" ? "list-disc" : "list-decimal"
          } marker:font-bold marker:text-[#066879]`}
        >
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              <RichText text={item} />
            </li>
          ))}
        </List>
      );
    }
    case "table":
      return (
        <div
          key={i}
          className="overflow-x-auto rounded-2xl border"
          style={{ borderColor: C.line }}
        >
          <table className="w-full min-w-[560px] border-collapse text-left text-sm sm:text-[15px]">
            <thead>
              <tr style={{ backgroundColor: C.ink }}>
                {block.head.map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-bold text-white">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr
                  key={row[0]}
                  style={{ backgroundColor: r % 2 ? C.page : C.white, borderTop: `1px solid ${C.line}` }}
                >
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th key={c} scope="row" className="px-4 py-3 align-top font-bold" style={{ color: C.ink }}>
                        {cell}
                      </th>
                    ) : (
                      <td key={c} className="px-4 py-3 align-top">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "note":
      return (
        <aside
          key={i}
          className="rounded-2xl border-l-4 px-5 py-4 text-[15px] font-medium"
          style={{ backgroundColor: C.amberBg, borderColor: C.amber, color: "#6B3F0B" }}
        >
          <RichText text={block.text} />
        </aside>
      );
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const toc = post.body.filter(
    (b): b is Extract<Block, { type: "h2" }> => b.type === "h2",
  );
  const more = sortedPosts().filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="w-full" style={{ backgroundColor: C.page }}>
      {/* Structured data. `<` is escaped so post copy can never close the tag. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(post.schema).replace(/</g, "\\u003c"),
        }}
      />

      {/* Header */}
      <header className="w-full px-4 pt-8 sm:px-6 sm:pt-12 lg:px-0 lg:pt-[64px]">
        <div
          className="relative mx-auto w-full max-w-[1232px] overflow-hidden rounded-[20px] sm:rounded-[24px]"
          style={{ background: HERO_GRADIENT }}
        >
          <div className="relative z-10 flex flex-col items-start gap-4 px-5 py-8 sm:px-8 sm:py-10 lg:px-[44px] lg:py-[48px]">
            <nav aria-label="Breadcrumb" className="text-xs font-semibold" style={{ color: "#CFE3E6" }}>
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{post.category}</span>
            </nav>
            <h1 className="max-w-[900px] text-[28px] font-extrabold leading-[36px] text-white sm:text-[36px] sm:leading-[46px] lg:text-[40px] lg:leading-[52px]">
              {post.title}
            </h1>
            <p className="text-sm font-medium" style={{ color: "#E7F0F0" }}>
              By {post.author} · <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time> · {post.readMinutes} min read
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1232px] grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-0 lg:py-14">
        {/* Body */}
        <div className="flex min-w-0 flex-col gap-5 text-base leading-[28px] sm:text-[17px] sm:leading-[30px]" style={{ color: C.body }}>
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[20px]" style={{ backgroundColor: C.chip }}>
            <Image
              src={post.cover.src}
              alt={post.cover.alt}
              fill
              priority
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-cover"
            />
          </div>

          {/* Quick summary + key takeaways */}
          <section
            className="flex flex-col gap-4 rounded-[20px] border bg-white p-5 sm:p-7"
            style={{ borderColor: C.line, boxShadow: C.shadow }}
          >
            <h2 className="text-lg font-extrabold" style={{ color: C.ink }}>Quick Summary</h2>
            {post.summary.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <h3 className="pt-1 text-base font-bold" style={{ color: C.brand }}>Key takeaways</h3>
            <ul className="flex flex-col gap-2">
              {post.takeaways.map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden className="mt-[11px] h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: C.brand }} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {post.body.map(renderBlock)}

          {/* FAQ */}
          <section id="faq" className="flex scroll-mt-24 flex-col gap-3 pt-6">
            <h2 className="text-[22px] font-extrabold leading-[30px] sm:text-[26px]" style={{ color: C.ink }}>
              Frequently Asked Questions
            </h2>
            {post.faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border bg-white px-5 py-4 open:shadow-[0px_8px_24px_rgba(7,59,71,0.08)]"
                style={{ borderColor: C.line }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden" style={{ color: C.ink }}>
                  {f.q}
                  <span aria-hidden className="text-xl transition-transform group-open:rotate-45" style={{ color: C.brand }}>+</span>
                </summary>
                <p className="pt-3 text-[15px] leading-[26px]">
                  <RichText text={f.a} />
                </p>
              </details>
            ))}
          </section>

          {/* Closing CTA */}
          <section className="mt-4 flex flex-col items-start gap-4 rounded-[20px] px-6 py-8 sm:px-8" style={{ background: HERO_GRADIENT }}>
            <p className="text-lg font-bold leading-7 text-white sm:text-xl">{post.closing}</p>
            <Link
              href="/"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-bold hover:opacity-90"
              style={{ color: C.ink }}
            >
              Explore Zoiko Social
            </Link>
          </section>
        </div>

        {/* Table of contents */}
        <aside className="hidden lg:block">
          <nav
            aria-label="On this page"
            className="sticky top-24 flex flex-col gap-1 rounded-[20px] border bg-white p-5"
            style={{ borderColor: C.line }}
          >
            <p className="pb-2 text-xs font-bold uppercase tracking-wide" style={{ color: C.muted }}>
              On this page
            </p>
            {toc.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                className="rounded-lg px-2 py-1.5 text-[13px] font-medium leading-5 hover:bg-[#EAF3F5]"
                style={{ color: C.ink }}
              >
                {h.text}
              </a>
            ))}
            <a href="#faq" className="rounded-lg px-2 py-1.5 text-[13px] font-medium leading-5 hover:bg-[#EAF3F5]" style={{ color: C.ink }}>
              FAQ
            </a>
          </nav>
        </aside>
      </div>

      {more.length > 0 && (
        <section className="w-full px-4 pb-16 sm:px-6 lg:px-0">
          <div className="mx-auto flex w-full max-w-[1232px] flex-col gap-6">
            <h2 className="text-2xl font-extrabold" style={{ color: C.ink }}>More from the blog</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="w-full px-4 pb-16 sm:px-6 lg:px-0">
        <div className="mx-auto w-full max-w-[1232px]">
          <Link href="/blog" className="text-sm font-bold hover:underline" style={{ color: C.brand }}>
            ← Back to all articles
          </Link>
        </div>
      </div>
    </article>
  );
}
