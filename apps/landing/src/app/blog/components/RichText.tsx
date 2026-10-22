import Link from "next/link";
import type { ReactNode } from "react";
import { C } from "./theme";

/*
  Renders the two inline markups used in posts.ts: **bold** and
  [label](href). Anything else is plain text, so post copy can never inject
  markup.
*/
const TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

export default function RichText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) out.push(text.slice(last, index));

    const [, bold, label, href] = match;
    if (bold !== undefined) {
      out.push(
        <strong key={index} className="font-bold" style={{ color: C.ink }}>
          {bold}
        </strong>,
      );
    } else if (href.startsWith("/")) {
      out.push(
        <Link
          key={index}
          href={href}
          className="font-semibold underline decoration-2 underline-offset-2 hover:opacity-80"
          style={{ color: C.brand }}
        >
          {label}
        </Link>,
      );
    } else {
      out.push(
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline decoration-2 underline-offset-2 hover:opacity-80"
          style={{ color: C.brand }}
        >
          {label}
        </a>,
      );
    }
    last = index + match[0].length;
  }

  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
