import { C } from "./theme";

/**
 * One row of the accessibility table. A cell is either a plain string or a
 * checkmark, which the design renders in orange.
 */
type Cell = string | "✓";

const ROWS: readonly { feature: string; free: Cell; premium: Cell }[] = [
  { feature: "Report posts & comments", free: "✓", premium: "✓" },
  { feature: "Report user behavior", free: "✓", premium: "✓" },
  { feature: "Priority review", free: "Standard", premium: "✓" },
  { feature: "Report without account", free: "✓", premium: "✓" },
  { feature: "Cost", free: "Free", premium: "Free" },
];

function TableCell({ value, bold }: { value: Cell; bold?: boolean }) {
  const check = value === "✓";
  return (
    <td className="h-16 px-6 text-base" style={{ borderTop: `1px solid ${C.line}` }}>
      {check ? (
        <span className="text-lg font-bold" style={{ color: C.orange }}>
          ✓
        </span>
      ) : (
        <span
          className={bold ? "font-bold" : "font-normal"}
          style={{ color: bold ? C.ink : C.muted }}
        >
          {value}
        </span>
      )}
    </td>
  );
}

export default function AccessibilityAcrossPlans() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6">
        <div className="flex flex-col gap-12">
          <h2 className="text-3xl font-extrabold leading-10" style={{ color: C.ink }}>
            Reporting accessibility across plans
          </h2>

          <div
            className="flex flex-col overflow-hidden rounded-[20px]"
            style={{ background: C.white, border: `1px solid ${C.line}` }}
          >
            <table className="w-full border-collapse text-left">
              <thead>
                <tr
                  style={{
                    background: C.tableHead,
                    borderBottom: `1px solid ${C.line}`,
                  }}
                >
                  {["Feature", "Free Member", "Premium Member"].map((h) => (
                    <th
                      key={h}
                      className="h-16 px-6 text-base font-bold"
                      style={{ color: C.brand }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.feature}>
                    <TableCell value={row.feature} bold />
                    <TableCell value={row.free} bold={row.feature === "Cost"} />
                    <TableCell value={row.premium} bold={row.feature === "Cost"} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}