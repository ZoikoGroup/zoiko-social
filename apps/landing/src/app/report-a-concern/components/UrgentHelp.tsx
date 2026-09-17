import Link from "next/link";
import { C } from "./theme";

export default function UrgentHelp() {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <div
          className="flex w-full flex-col items-start gap-4 rounded-[20px] border px-6 pt-7 pb-5 lg:flex-row"
         style={{
  backgroundColor: C.dangerBg,
  borderColor: C.dangerLine,

          }}
        >
          {/* ICON */}
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white"
          >
            <div className="relative size-5 overflow-hidden">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M10 2.5L18.33 17.5H1.67L10 2.5Z"
                  stroke="#D94A4A"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 8.33V11.67"
                  stroke="#D94A4A"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                />
                <circle
                  cx="10"
                  cy="14.17"
                  r="0.83"
                  fill="#D94A4A"
                />
              </svg>
            </div>
          </div>

          {/* CONTENT */}
          <div className="min-w-0 flex-1">
            <div>
              <p
                className="text-sm font-bold leading-5"
                style={{ color: "#9F3030" }}
              >
                If a person or animal may be in immediate danger, get help
                first.
              </p>
            </div>

            <div className="mt-0.5">
              <p
                className="text-xs font-normal leading-5"
                style={{ color: "#9F3030" }}
              >
                Contact the appropriate local emergency or animal-welfare
                authority. Zoiko Social reports are not an emergency response
                channel — our team reviews reports, but cannot dispatch help in
                real time.
              </p>
            </div>
          </div>

          {/* LINK */}
          <div className="shrink-0 lg:pt-0.5">
            <Link
              href="/urgent-help"
              className="text-xs font-bold leading-5 underline transition-opacity hover:opacity-75"
              style={{ color: "#D94A4A" }}
            >
              Get urgent help &gt;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}