import Image from "next/image";
import Link from "next/link";
import { formatDate, type BlogPost } from "../posts";
import { C } from "./theme";

export default function PostCard({
  post,
  featured = false,
}: {
  post: BlogPost;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex overflow-hidden rounded-[20px] border bg-white transition-shadow hover:shadow-[0px_8px_24px_rgba(7,59,71,0.14)] ${
        featured ? "flex-col lg:flex-row" : "flex-col"
      }`}
      style={{ borderColor: C.line }}
    >
      <div
        className={`relative w-full shrink-0 overflow-hidden ${
          featured ? "aspect-[16/9] lg:aspect-auto lg:w-[52%]" : "aspect-[16/9]"
        }`}
        style={{ backgroundColor: C.chip }}
      >
        <Image
          src={post.cover.src}
          alt={post.cover.alt}
          fill
          sizes={featured ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 400px, 100vw"}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div
        className={`flex flex-1 flex-col gap-3 p-5 sm:p-6 ${
          featured ? "lg:justify-center lg:p-10" : ""
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: C.chip, color: C.brand }}
          >
            {post.category}
          </span>
          <span style={{ color: C.muted }}>
            {formatDate(post.datePublished)} · {post.readMinutes} min read
          </span>
        </div>

        <h2
          className={`font-extrabold ${
            featured
              ? "text-[22px] leading-[30px] sm:text-[28px] sm:leading-[38px]"
              : "text-lg leading-7"
          }`}
          style={{ color: C.ink }}
        >
          {post.title}
        </h2>

        <p className="text-sm leading-6 sm:text-[15px]" style={{ color: C.muted }}>
          {post.excerpt}
        </p>

        <span
          className="mt-auto pt-2 text-sm font-bold group-hover:underline"
          style={{ color: C.brand }}
        >
          Read article →
        </span>
      </div>
    </Link>
  );
}
