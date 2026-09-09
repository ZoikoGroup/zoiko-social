"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import DiscoverDropdown from "@/components/DiscoverDropdown";
import CommunitiesDropdown from "@/components/CommunitiesDropdown";
import NewsDropdown from "@/components/NewsDropdown";
import EventsDropdown from "@/components/EventsDropdown";
import AdoptDropdown from "@/components/AdoptDropdown";
import MarketDropdown from "@/components/MarketDropdown";
import PremiumDropdown from "@/components/PremiumDropdown";
import SafetyDropdown from "@/components/SafetyDropdown";
import { APP_LINKS, NAV_LINKS } from "@/lib/app-links";

/* The nav items that open a panel, keyed by their NAV_LINKS label. Everything
   else stays a plain link, so the nav is still one map over NAV_LINKS rather
   than a special case per item — adding the next panel is one line here. */
const DROPDOWNS: Partial<Record<string, () => React.JSX.Element>> = {
  Discover: DiscoverDropdown,
  Communities: CommunitiesDropdown,
  News: NewsDropdown,
  Events: EventsDropdown,
  Adopt: AdoptDropdown,
  Market: MarketDropdown,
  Premium: PremiumDropdown,
  Safety: SafetyDropdown,
};

/* The logo is served from /public and rendered `unoptimized` — Next's image
   optimizer refuses SVG unless `dangerouslyAllowSVG` is set, which is a config
   change this header does not need. */
const LOGO = "/header/logo.svg";

/* The two icons are inlined rather than fetched. Their path data is copied
   verbatim from the exported public/header/search.svg and chevron-down.svg, so
   the artwork is identical, but inlining renders them without a request each —
   the chevron alone would otherwise be nine — and takes the file loading out
   of the picture entirely. */
function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2"
    >
      <path
        d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
        stroke="#9CA3AF"
        strokeWidth="1.66667"
      />
      <path
        d="M17.5 17.5L13.875 13.875"
        stroke="#9CA3AF"
        strokeWidth="1.66667"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={`size-3.5 shrink-0 ${className}`}
    >
      <path
        d="M3.5 5.25L7 8.75L10.5 5.25"
        stroke="#7C8791"
        strokeWidth="1.28333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Search box.
 *
 * A plain GET form rather than a click handler: the app is a separate origin,
 * so this has to be a full navigation anyway, and `q` is the parameter its
 * /search page already reads. `required` keeps an empty submit from navigating
 * to an empty result set.
 *
 * Rendered twice — inline in the bar on wide screens, and inside the menu panel
 * on narrow ones, where the bar has no room for it.
 */
function SearchForm({ className = "" }: { className?: string }) {
  return (
    <form
      action={APP_LINKS.search}
      method="get"
      role="search"
      className={`relative ${className}`}
    >
      <SearchIcon />
      <input
        type="search"
        name="q"
        required
        aria-label="Search ZoikoSocial"
        className="h-11 w-full rounded-full border border-gray-300 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-cyan-700"
      />
    </form>
  );
}

/**
 * The header itself.
 *
 * Mounted under a `key` of the current route by the wrapper below, so a
 * navigation throws this component's state away and builds it fresh. Both
 * panels are siblings of the page rather than part of it, and would otherwise
 * be left standing open over the new page; remounting closes them without an
 * effect that writes state straight back on every route change.
 */
function HeaderBar({ pathname }: { pathname: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  /* Which panel is open, by label. Only one at a time. */
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  /* The open panel and where it sits in the nav, resolved once rather than
     inside the map. */
  const OpenDropdown = openDropdown === null ? undefined : DROPDOWNS[openDropdown];
  const openIndex = NAV_LINKS.findIndex(({ label }) => label === openDropdown);

  /* Which item carries the underline and tint.
   *
   * `pathname` alone cannot answer this: Home is the only item that points at
   * a landing route, so every other item would leave the highlight sitting on
   * Home. Picking an item moves it there, and `null` falls back to the route,
   * so a plain page load still lights up Home. */
  const [selected, setSelected] = useState<string | null>(null);

  /* Escape closes the open panel. Pointer users get this from the hover-out on
     the wrapper; keyboard users would otherwise have no way back out. */
  useEffect(() => {
    if (openDropdown === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenDropdown(null);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openDropdown]);

  return (
    <header className="relative z-50 w-full border-b border-gray-200 bg-white font-inter">
      {/* Top row — logo, search, account actions */}
      <div className="h-20">
        <div className="mx-auto flex h-full max-w-[1440px] items-center gap-4 px-4 sm:px-6 xl:gap-7 xl:px-20">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src={LOGO}
              alt="Zoiko Social"
              width={157}
              height={46}
              priority
              unoptimized
              className="h-9 w-auto sm:h-10 xl:h-[46px]"
            />
          </Link>

          {/* Search — pinned to the design width of 600px once there is room
              for it, elastic in between, and moved into the menu panel below
              `md`, where the bar cannot hold it and the actions too. */}
          <SearchForm className="hidden min-w-0 flex-1 md:block xl:w-[600px] xl:flex-none" />

          {/* Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
            <Link
              href={APP_LINKS.signIn}
              className="hidden min-h-11 items-center justify-center rounded-full px-5 py-3 text-center text-sm font-semibold text-gray-900 transition hover:bg-gray-50 sm:inline-flex"
            >
              Sign In
            </Link>

            <Link
              href={APP_LINKS.signUp}
              className="flex h-10 w-28 items-center justify-center rounded-full bg-cyan-800 text-base font-bold text-white transition hover:bg-cyan-900"
            >
              Join Free
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="header-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="-mr-2 flex size-11 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 xl:hidden"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation — the nine items need the full 1280px content width the
          design gives them, so below `xl` they move into the menu panel. */}
      <div className="hidden h-14 border-t border-gray-200 xl:block">
        {/* The panel is positioned against this row, not against the item that
            opens it — a 780px panel hung off a ~140px item runs off the right
            edge for anything past the middle of the nav. It is also the hover
            region: the panel is inside it, so moving the pointer down into the
            panel does not count as leaving. */}
        <div
          className="relative mx-auto flex h-full max-w-[1440px] px-20"
          onMouseLeave={() => setOpenDropdown(null)}
        >
          {NAV_LINKS.map(({ label, href }) => {
            const isActive =
              selected === null ? pathname === href : selected === label;
            const Dropdown = DROPDOWNS[label];
            const isOpen = openDropdown === label;

            /* Home is the only landing-site route and the only item the design
               draws without a chevron. */
            const chevron = href !== "/" && (
              <ChevronDownIcon
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            );

            const itemClass = `flex h-full w-full min-w-0 items-center justify-center gap-1.5 whitespace-nowrap border-b-2 text-base font-semibold leading-6 transition-all ${
              isActive || isOpen
                ? "border-cyan-800 bg-[#F6FDFF] text-cyan-800"
                : "border-transparent text-gray-600 hover:border-cyan-800 hover:bg-[#F6FDFF] hover:text-cyan-800"
            }`;

            return (
              <div
                key={label}
                className="flex min-w-0 flex-1"
                /* Hovering a plain item closes whatever was open, so sliding
                   along the nav does not leave a stale panel behind. */
                onMouseEnter={() => setOpenDropdown(Dropdown ? label : null)}
              >
                {Dropdown ? (
                  /* A button rather than a link: this item opens a panel, and
                     the panel's own "Explore All" is the way through to the
                     app. A link here would navigate away on the first click. */
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(label);
                      setOpenDropdown((open) => (open === label ? null : label));
                    }}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    className={itemClass}
                  >
                    {label}
                    {chevron}
                  </button>
                ) : (
                  <Link
                    href={href}
                    onClick={() => setSelected(label)}
                    aria-current={isActive ? "page" : undefined}
                    className={itemClass}
                  >
                    {label}
                    {chevron}
                  </Link>
                )}

              </div>
            );
          })}

          {/* The open panel, pinned to whichever gutter its item sits nearer.
              Either way it lands wholly inside the row, which is at least
              1120px wide wherever this nav is shown. */}
          {OpenDropdown && (
            <div
              className={`absolute top-full z-50 ${
                openIndex >= NAV_LINKS.length / 2 ? "right-20" : "left-20"
              }`}
            >
              <OpenDropdown />
            </div>
          )}
        </div>
      </div>

      {/* Menu panel — everything the bar could not fit, on one scrollable sheet
          so a short viewport can still reach the last item. */}
      {menuOpen && (
        <div
          id="header-menu"
          className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-gray-200 xl:hidden"
        >
          <div className="px-4 py-4 sm:px-6 md:hidden">
            <SearchForm className="w-full" />
          </div>

          {/* The same eight panels as the desktop nav, as an accordion. Each
              renders full-width and stacked here, so one is open at a time and
              the sheet scrolls. */}
          <nav className="pb-2">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive =
                selected === null ? pathname === href : selected === label;
              const Dropdown = DROPDOWNS[label];
              const isOpen = openDropdown === label;

              const itemClass = `flex w-full items-center justify-between border-l-2 px-4 py-3.5 text-left text-base font-semibold leading-6 transition-all sm:px-6 ${
                isActive || isOpen
                  ? "border-cyan-800 bg-[#F6FDFF] text-cyan-800"
                  : "border-transparent text-gray-600 hover:bg-[#F6FDFF] hover:text-cyan-800"
              }`;

              if (!Dropdown) {
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setSelected(label)}
                    aria-current={isActive ? "page" : undefined}
                    className={itemClass}
                  >
                    {label}
                    {href !== "/" && <ChevronDownIcon />}
                  </Link>
                );
              }

              return (
                <div key={label}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(label);
                      setOpenDropdown((open) =>
                        open === label ? null : label,
                      );
                    }}
                    aria-expanded={isOpen}
                    className={itemClass}
                  >
                    {label}
                    <ChevronDownIcon
                      className={`transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-y border-gray-100 bg-white">
                      <Dropdown />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 px-4 py-4 sm:hidden">
            <Link
              href={APP_LINKS.signIn}
              className="flex min-h-11 items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default function Header() {
  const pathname = usePathname();

  return <HeaderBar key={pathname} pathname={pathname} />;
}
