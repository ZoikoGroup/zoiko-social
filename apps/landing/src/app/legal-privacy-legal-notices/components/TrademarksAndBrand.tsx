import { Ban, ChevronRight, Info, PawPrint } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type PanelKind = "wordmark" | "logo" | "endorsement";

type Paragraph = {
  lead: string;
  strong?: string;
};

type BrandCard = {
  id: string;
  title: string;
  panel: PanelKind;
  paragraphs: readonly Paragraph[];
  link?: string;
};

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

const BRAND_CARDS = [
  {
    id: "word-mark",
    title: "Word mark",
    panel: "wordmark",
    paragraphs: [
      { lead: "Status and symbol: ", strong: "™ · US application pending (sample)" },
      {
        lead: "Registered in: ",
        strong: "United States, United Kingdom, European Union (sample)",
      },
    ],
  },
  {
    id: "logo-and-design-marks",
    title: "Logo and design marks",
    panel: "logo",
    paragraphs: [
      { lead: "Status and symbol: ", strong: "™ · Registration in progress (sample)" },
      { lead: "Placeholder shown. Use the supplied logo file." },
    ],
  },
  {
    id: "no-implied-endorsement",
    title: "No implied endorsement",
    panel: "endorsement",
    paragraphs: [
      {
        lead: "Using our marks must not suggest we sponsor or endorse you without written permission.",
      },
    ],
    link: "Brand Assets and permissions",
  },
] as const satisfies readonly BrandCard[];

/* -------------------------------------------------------------------------- */
/*                                Sub-components                              */
/* -------------------------------------------------------------------------- */

function WordmarkVisual() {
  return (
    <span
      role="img"
      aria-label="Zoiko Social"
      className="text-[27px] font-bold leading-none tracking-[-0.03em] text-[#0B6474]"
    >
      <span aria-hidden="true">
        Zo
        <span className="relative">
          ı
          <span className="absolute left-1/2 top-[1px] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#F0902F]" />
        </span>
        ko Social
      </span>
    </span>
  );
}

function PanelVisual({ kind }: { kind: PanelKind }) {
  switch (kind) {
    case "wordmark":
      return <WordmarkVisual />;
    case "logo":
      return (
        <span className="flex h-[65px] w-[65px] items-center justify-center rounded-2xl bg-[#E6F4F4] text-[#0B5E6B]">
          <PawPrint className="h-[30px] w-[30px]" strokeWidth={1.75} />
        </span>
      );
    case "endorsement":
      return (
        <span className="flex h-[41px] w-[41px] items-center justify-center rounded-xl bg-[#E6F4F4] text-[#0B5E6B]">
          <Ban className="h-5 w-5" strokeWidth={1.75} />
        </span>
      );
    default:
      return null;
  }
}

function BrandCardView({ card }: { card: BrandCard }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[22px] border border-[#DCE3E7] bg-white">
      <div className="flex h-[121px] items-center justify-center border-b border-[#DCE3E7] bg-[#F4F7F9]">
        <PanelVisual kind={card.panel} />
      </div>

      <div className="flex-1 px-5 pb-[17px] pt-[18px]">
        <h3 className="text-[17px] font-semibold leading-6 text-[#0B3A44]">{card.title}</h3>
        <div className="mt-[7px] space-y-[7px]">
          {card.paragraphs.map((paragraph) => (
            <p key={paragraph.lead} className="text-sm leading-[22px] text-[#4B5A61]">
              {paragraph.lead}
              {"strong" in paragraph && paragraph.strong ? (
                <strong className="font-semibold text-[#10262D]">{paragraph.strong}</strong>
              ) : null}
            </p>
          ))}
        </div>
        {"link" in card && card.link ? (
          <a
            href="#"
            className="mt-[7px] inline-flex items-center gap-1.5 text-sm font-semibold leading-[22px] text-[#0B6474] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6474]"
          >
            {card.link}
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </a>
        ) : null}
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

export default function TrademarksAndBrand() {
  return (
    <main className="bg-white font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,-apple-system,'Segoe_UI',sans-serif] antialiased">
      <section
        aria-labelledby="trademarks-heading"
        className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:pt-[42px] lg:px-0"
      >
        <header>
          <h1
            id="trademarks-heading"
            className="text-3xl font-bold leading-10 tracking-[-0.02em] text-[#0B4A55] sm:text-4xl"
          >
            Trademarks and brand
          </h1>
          <p className="mt-2.5 text-base leading-[26px] text-[#6B7780] sm:text-[17px]">
            Zoiko Social names and logos, and how they may be used.
          </p>
        </header>

        <ul className="m-0 mt-[37px] grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
          {BRAND_CARDS.map((card) => (
            <li key={card.id}>
              <BrandCardView card={card} />
            </li>
          ))}
        </ul>

        <p className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-[#C5CFD4] bg-[#F4F7F9] px-[22px] py-[14px] text-[13px] leading-5 text-[#5B6B72]">
          <Info className="h-4 w-4 shrink-0 text-[#0B6474]" strokeWidth={1.75} />
          <span>
            ™ and ® symbols are set only by Trademark Legal records, never by design or content
            teams.
          </span>
        </p>
      </section>
    </main>
  );
}
