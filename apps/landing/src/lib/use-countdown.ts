"use client";

import { useSyncExternalStore } from "react";

/** Black Friday 2026 — every Black Friday countdown on the site runs to this moment. */
export const BLACK_FRIDAY_AT = "2026-11-27T00:00:00";

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}
const nowInSeconds = () => Math.floor(Date.now() / 1000);
// The server has no meaningful "now" for the visitor, so it renders placeholders.
const serverSnapshot = () => null;

/** Days/hours/minutes/seconds left until `target`, or nulls before hydration. */
export function useCountdown(target: string) {
  const now = useSyncExternalStore(subscribe, nowInSeconds, serverSnapshot);
  const end = Math.floor(new Date(target).getTime() / 1000);
  const left = now === null ? null : Math.max(0, end - now);
  return [
    { label: "Days", value: left === null ? null : Math.floor(left / 86400) },
    { label: "Hrs", value: left === null ? null : Math.floor((left % 86400) / 3600) },
    { label: "Min", value: left === null ? null : Math.floor((left % 3600) / 60) },
    { label: "Sec", value: left === null ? null : left % 60 },
  ];
}

export const pad = (v: number | null) => (v === null ? "--" : String(v).padStart(2, "0"));
