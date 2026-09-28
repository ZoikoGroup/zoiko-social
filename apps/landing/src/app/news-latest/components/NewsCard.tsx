"use client";

import Image from "next/image";
import { C } from "./theme";

export type NewsItem = {
  id: number;
  category: string;
  published: string;
  source: string;
  rating?: string;
  ratingType?: "normal" | "warning" | "unavailable";
  domain: string;
  title: string;
  description: string;
  image?: string;
  lead?: boolean;
  notice?: string;
  warning?: boolean;
  corrected?: boolean;
};

type Props = {
  item: NewsItem;
};

function CategoryIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12.5C5 8.36 8.36 5 12.5 5C16.64 5 20 8.36 20 12.5C20 16.64 16.64 20 12.5 20C8.36 20 5 16.64 5 12.5Z"
        stroke={C.azure42}
        strokeWidth="1.6"
      />

      <path
        d="M9 13.5C10.2 14.8 11.3 15.5 12.5 15.5C13.7 15.5 14.8 14.8 16 13.5"
        stroke={C.azure42}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3L14.4 4.7L17.3 4.6L18.1 7.4L20.4 9.1L19.3 11.8L20.1 14.6L17.6 16.2L16.8 19L13.9 18.8L11.5 20.5L9.1 18.8L6.2 19L5.4 16.2L3.1 14.6L3.9 11.8L2.8 9.1L5.1 7.4L5.9 4.6L8.8 4.7L12 3Z"
        fill={C.cyan25}
      />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 4.5C6 3.67 6.67 3 7.5 3H16.5C17.33 3 18 3.67 18 4.5V21L12 17.5L6 21V4.5Z"
        stroke={C.azure42}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 15V3"
        stroke={C.azure42}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <path
        d="M7.5 7.5L12 3L16.5 7.5"
        stroke={C.azure42}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5 13V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V13"
        stroke={C.azure42}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="2" cy="8" r="1.5" fill={C.azure42} />
      <circle cx="7" cy="8" r="1.5" fill={C.azure42} />
      <circle cx="12" cy="8" r="1.5" fill={C.azure42} />
    </svg>
  );
}

/* Triangle + ! icon */
function WarningTriangleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10.27 4.73L3.34 16.73C2.57 18.06 3.53 19.75 5.07 19.75H18.93C20.47 19.75 21.43 18.06 20.66 16.73L13.73 4.73C12.96 3.4 11.04 3.4 10.27 4.73Z"
        stroke={C.orange45}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <path
        d="M12 9V13"
        stroke={C.orange45}
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="16"
        r="0.9"
        fill={C.orange45}
      />
    </svg>
  );
}

/* Corrected story icon */
function CorrectedIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 8.5C7.1 5.9 9.4 4.5 12.2 4.5C15.8 4.5 18.5 7.1 18.5 10.5"
        stroke={C.orange45}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M18.5 6.5V10.5H14.5"
        stroke={C.orange45}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M18 15.5C16.9 18.1 14.6 19.5 11.8 19.5C8.2 19.5 5.5 16.9 5.5 13.5"
        stroke={C.orange45}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M5.5 17.5V13.5H9.5"
        stroke={C.orange45}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NewsCard({ item }: Props) {
  return (
    <article
      className="w-full rounded-[20px] border bg-white p-5"
      style={{
        borderColor: C.line,
        boxShadow: item.lead ? C.shadow : undefined,
      }}
    >
      {/* Lead Story */}
      {item.lead && (
        <div className="mb-1 flex items-center gap-2">
          <span
            className="text-base leading-none"
            style={{ color: C.orange45 }}
          >
            ★
          </span>

          <span
            className="text-xs font-extrabold uppercase tracking-wide"
            style={{ color: C.orange45 }}
          >
            Lead story
          </span>
        </div>
      )}

      {/* Category + Published */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <div
          className="inline-flex h-7 items-center gap-1.5 rounded-full border px-3"
          style={{
            backgroundColor: C.grey97,
            borderColor: C.line,
          }}
        >
          <CategoryIcon />

          <span
            className="text-xs font-bold leading-4"
            style={{ color: C.azure42 }}
          >
            {item.category}
          </span>
        </div>

        <span
          className="text-xs font-normal leading-5"
          style={{ color: C.azure42 }}
        >
          {item.published}
        </span>
      </div>

      {/* Source */}
      <div className="flex flex-col gap-px pt-2">
        <div className="flex flex-wrap items-center gap-[5px]">
          <span
            className="text-sm font-bold leading-5"
            style={{ color: C.cyan13 }}
          >
            {item.source}
          </span>

          <VerifiedIcon />

          {item.rating && (
            <span
              className="rounded-full px-2 py-[3px] text-xs font-bold"
              style={{
                backgroundColor:
                  item.ratingType === "warning"
                    ? "#FFF4E5"
                    : C.grey95,
                color:
                  item.ratingType === "warning"
                    ? C.orange45
                    : C.cyan15,
              }}
            >
              {item.rating}
            </span>
          )}
        </div>

        <span
          className="text-xs font-normal leading-5"
          style={{ color: C.azure42 }}
        >
          {item.domain}
        </span>
      </div>

      {/* Safety notice */}
      {item.notice && (
        <div
          className="mt-2 rounded-lg px-2.5 py-3"
          style={{
            backgroundColor: C.grey97,
          }}
        >
          <p
            className="text-xs font-normal leading-4"
            style={{ color: C.azure42 }}
          >
            {item.notice}
          </p>
        </div>
      )}

      {/* Title */}
      <h2
        className="pt-1 text-base font-bold leading-5"
        style={{ color: C.cyan13 }}
      >
        {item.title}
      </h2>

      {/* Description */}
      <p
        className="text-sm font-normal leading-6"
        style={{ color: C.cyan13 }}
      >
        {item.description}
      </p>

      {/* Corrected notice */}
      {item.corrected && (
        <div
          className="mt-2.5 flex w-full items-start gap-2.5 rounded-[10px] border px-3.5 py-2.5"
          style={{
            backgroundColor: C.grey95,
            borderColor: C.orange53,
          }}
        >
          <div className="flex size-4 shrink-0 items-start pt-px">
            <CorrectedIcon />
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="text-xs leading-5"
              style={{ color: C.orange25 }}
            >
              <span className="font-bold">
                Corrected 1 hour ago:
              </span>{" "}
              <span className="font-normal">
                Funding figures were corrected from an earlier version of
                this story. Original publish time is unchanged.
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Normal image */}
      {item.image && !item.warning && (
        <div
          className="relative mt-1 h-[384px] w-full overflow-hidden rounded-2xl"
          style={{
            background: `linear-gradient(61deg, ${C.imageGradientStart}, ${C.imageGradientEnd})`,
          }}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="678px"
          />
        </div>
      )}

      {/* Warning image */}
      {item.warning && (
        <div className="relative mt-1 h-[384px] w-full overflow-hidden rounded-2xl">
          {item.image && (
            <Image
              src={item.image}
              alt=""
              fill
              className="object-cover"
              sizes="678px"
            />
          )}

          <div
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(7,59,71,.88), rgba(65,65,38,.76))",
            }}
          >
            {/* Triangle with ! */}
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/90">
              <WarningTriangleIcon />
            </div>

            <p className="text-center text-sm font-semibold leading-5 text-white">
              This story contains graphic content related to an
              <br />
              animal welfare situation.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button className="rounded-[10px] bg-white px-4 py-2 text-sm font-semibold text-[#073B47]">
                Reveal
              </button>

              <button className="rounded-[10px] border border-white/60 px-4 py-2 text-sm font-semibold text-white">
                Skip
              </button>

              <button className="rounded-[10px] border border-white/60 px-4 py-2 text-sm font-semibold text-white">
                Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div
        className="mt-3 flex flex-wrap items-center gap-1 border-t pt-3"
        style={{ borderColor: C.line }}
      >
        <button
          className="rounded-lg px-3 py-1.5 text-xs font-bold"
          style={{ color: C.cyan15 }}
        >
          Open Source
        </button>

        <button
          className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold"
          style={{ color: C.azure42 }}
        >
          <SaveIcon />
          Save
        </button>

        <button
          className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold"
          style={{ color: C.azure42 }}
        >
          <ShareIcon />
          Share
        </button>

        {item.lead && (
          <button
            className="rounded-lg px-3 py-1.5 text-xs font-semibold"
            style={{ color: C.azure42 }}
          >
            Discuss in Community
          </button>
        )}

        <button
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg border-2"
          style={{
            backgroundColor: C.grey94,
            borderColor: C.cyan15,
          }}
          aria-label="More options"
        >
          <MoreIcon />
        </button>
      </div>
    </article>
  );
}