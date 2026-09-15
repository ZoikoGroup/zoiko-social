import {
  Clock,
  DollarSign,
  Image as ImageIcon,
  Lock,
  MessageSquare,
  Route,
  Shield,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { C } from "./theme";
import { RED_FLAGS } from "./guidance";

const ICONS: LucideIcon[] = [
  UserRound,
  Clock,
  DollarSign,
  MessageSquare,
  ImageIcon,
  Route,
  Lock,
  Shield,
];

/** Full-width caution rows: things that are a reason to slow down, not proof. */
export default function RedFlags() {
  return (
    <section className="pt-16">
      <div className="mx-auto flex max-w-[640px] flex-col gap-3 text-center">
        <h2
          className="text-2xl font-extrabold leading-tight sm:text-3xl sm:leading-[48px]"
          style={{ color: C.ink }}
        >
          Red flags: pause and verify
        </h2>
        <p className="text-base leading-6" style={{ color: C.muted }}>
          None of these are proof of wrongdoing on their own — they&apos;re
          reasons to slow down and check.
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-[900px] flex-col gap-3">
        {RED_FLAGS.map((flag, i) => {
          const Icon = ICONS[i];
          return (
            <article
              key={flag.title}
              className="flex items-start gap-3.5 rounded-2xl px-4 py-4"
              style={{ background: C.warnFill, border: `1px solid ${C.warnLine}` }}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-white">
                <Icon size={16} strokeWidth={1.8} style={{ color: C.warnInk }} />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
                  {flag.title}
                </h3>
                <p className="text-xs leading-5" style={{ color: C.muted }}>
                  {flag.body}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
