import type { Metadata } from "next";
import PostCard from "./components/PostCard";
import { C, HERO_GRADIENT } from "./components/theme";
import { SITE_URL, sortedPosts } from "./posts";

export const metadata: Metadata = {
  title: "Blog | Zoiko Social",
  description:
    "Guides and insights from the Zoiko Social Editorial Team on pet care, animal welfare, adoption, and online animal communities.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

/**
 * Blog archive. The newest post is shown as a wide featured card; the rest
 * fall into a three-column grid. Posts come from ./posts.ts.
 */
export default function BlogArchivePage() {
  const [featured, ...rest] = sortedPosts();

  return (
    <div className="w-full" style={{ backgroundColor: C.page }}>
      <section className="w-full px-4 pt-10 pb-8 sm:px-6 sm:pt-14 lg:px-0 lg:pt-[80px] lg:pb-[40px]">
        <div
          className="relative mx-auto w-full max-w-[1232px] overflow-hidden rounded-[20px] sm:rounded-[24px]"
          style={{ background: HERO_GRADIENT }}
        >
          <div
            className="absolute inset-y-0 right-0 w-full sm:w-[70%] lg:w-[58%]"
            style={{
              background:
                "radial-gradient(ellipse at 75% 45%, rgba(255,255,255,0.10) 0%, rgba(62,109,110,0.10) 35%, rgba(29,82,88,0) 72%)",
            }}
          />
          <div className="relative z-10 flex flex-col items-start gap-3 px-5 py-10 sm:px-8 sm:py-12 lg:px-[44px] lg:py-[56px]">
            <span
              className="rounded-[20px] px-3 py-[5px] text-xs font-semibold tracking-wide text-white"
              style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
            >
              Zoiko Social · Blog
            </span>
            <h1 className="text-[30px] font-extrabold leading-[38px] text-white sm:text-[36px] sm:leading-[48px]">
              Stories, Guides &amp; Insights
            </h1>
            <p
              className="max-w-[702px] text-sm leading-[22px] sm:text-base sm:leading-6"
              style={{ color: "#E7F0F0" }}
            >
              Practical reading on pet care, responsible adoption, animal
              welfare, and the communities that bring animal lovers together.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full px-4 pb-16 sm:px-6 lg:px-0 lg:pb-24">
        <div className="mx-auto flex w-full max-w-[1232px] flex-col gap-8">
          {featured ? (
            <PostCard post={featured} featured />
          ) : (
            <p className="text-center text-base" style={{ color: C.muted }}>
              No articles yet — check back soon.
            </p>
          )}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
