import { Check, Star } from "lucide-react";
import { C } from "./theme";

type Cell = { kind: "dash" } | { kind: "text"; text: string } | { kind: "check"; text: string } | { kind: "star"; text: string };

const COLUMNS = ["Capability", "Free Accounts", "Premium Members", "Community Organizers"];

const ROWS: { capability: string; cells: Cell[] }[] = [
  {
    capability: "Create & manage profile",
    cells: [
      { kind: "check", text: "Included" },
      { kind: "check", text: "Included" },
      { kind: "check", text: "Included" },
    ],
  },
  {
    capability: "Join communities",
    cells: [
      { kind: "check", text: "Unlimited" },
      { kind: "check", text: "Unlimited" },
      { kind: "check", text: "Unlimited" },
    ],
  },
  {
    capability: "Create communities",
    cells: [
      { kind: "text", text: "Limited (1)" },
      { kind: "check", text: "Up to 3" },
      { kind: "check", text: "Unlimited" },
    ],
  },
  {
    capability: "Host events",
    cells: [
      { kind: "check", text: "Included" },
      { kind: "check", text: "Included" },
      { kind: "check", text: "Advanced tools" },
    ],
  },
  {
    capability: "Advanced analytics",
    cells: [{ kind: "dash" }, { kind: "star", text: "Available" }, { kind: "star", text: "Full suite" }],
  },
  {
    capability: "Community moderation",
    cells: [
      { kind: "check", text: "Basic" },
      { kind: "check", text: "Enhanced" },
      { kind: "star", text: "Full tools" },
    ],
  },
  {
    capability: "Featured placement",
    cells: [{ kind: "dash" }, { kind: "star", text: "Limited" }, { kind: "star", text: "Full access" }],
  },
  {
    capability: "API access",
    cells: [{ kind: "dash" }, { kind: "dash" }, { kind: "star", text: "Available" }],
  },
];

function CellContent({ cell }: { cell: Cell }) {
  if (cell.kind === "dash") {
    return <span style={{ color: C.muted }}>—</span>;
  }
  if (cell.kind === "text") {
    return <span style={{ color: C.muted }}>{cell.text}</span>;
  }
  const isStar = cell.kind === "star";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap"
      style={{
        backgroundColor: isStar ? C.orangeFill : C.chip,
        color: isStar ? C.orangeText : C.brand,
      }}
    >
      {isStar ? <Star className="size-3.5 fill-current" /> : <Check className="size-3.5" />}
      {cell.text}
    </span>
  );
}

/** "Platform Capabilities at a Glance" — teal-header comparison table. */
export default function CapabilityMatrix() {
  return (
    <section className="w-full px-4 py-12 sm:px-8 sm:py-16 lg:px-[105px] lg:py-20" style={{ backgroundColor: C.panel }}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8 lg:gap-12">
        <h2
          className="text-center font-jakarta text-2xl font-extrabold tracking-[-0.36px] sm:text-3xl lg:text-4xl"
          style={{ color: C.ink }}
        >
          Platform Capabilities at a Glance
        </h2>

        <div className="w-full overflow-x-auto rounded-2xl border" style={{ borderColor: C.line }}>
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead style={{ backgroundColor: C.brand }}>
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col} className="p-6 text-center text-sm font-bold text-white">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.capability} className="bg-white" style={{ borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}>
                  <td className="p-6 text-sm font-bold whitespace-nowrap" style={{ color: C.ink }}>
                    {row.capability}
                  </td>
                  {row.cells.map((cell, j) => (
                    <td key={j} className="p-6 text-center">
                      <CellContent cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
