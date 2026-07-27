import { STATUS_ORDER, USER_DEPT } from "./data";
import type { Filters, Initiative, Status } from "./types";

const MONTHS_RU = [
  "янв.",
  "февр.",
  "мар.",
  "апр.",
  "мая",
  "июн.",
  "июл.",
  "авг.",
  "сент.",
  "окт.",
  "нояб.",
  "дек.",
];

export const STATUS_GROUPS: Record<string, Status[]> = {
  progress: ["В работе", "Product Hub", "Пилот"],
  done: ["Стандарт", "Внедрение"],
  rejected: ["Отклонено", "На доработке"],
};

export function fmtDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return s;
  return `${String(d).padStart(2, "0")} ${MONTHS_RU[m - 1]} ${y}`;
}

export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export function nextInitiativeId(items: Initiative[]) {
  let max = 0;
  items.forEach((i) => {
    const m = String(i.id).match(/(\d+)$/);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return `BI-2026-${String(max + 1).padStart(4, "0")}`;
}

/** Витрина: только инициативы своего отдела */
export function deptInitiatives(items: Initiative[]) {
  return items.filter((i) => i.dept === USER_DEPT);
}

export function filterInitiatives(items: Initiative[], f: Filters) {
  return items.filter((i) => {
    if (f.statusGroup) {
      const group = STATUS_GROUPS[f.statusGroup];
      if (group && !group.includes(i.status)) return false;
    } else if (f.status && i.status !== f.status) {
      return false;
    }
    if (f.type && i.type !== f.type) return false;
    if (f.impact && i.impact !== f.impact) return false;
    if (f.effect && i.effect !== f.effect) return false;
    if (f.effort && i.effort !== f.effort) return false;
    if (f.search) {
      const hay = `${i.title} ${i.author} ${i.project} ${i.id}`.toLowerCase();
      if (!hay.includes(f.search.trim().toLowerCase())) return false;
    }
    return true;
  });
}

export function filterOptions(
  items: Initiative[],
  dictTypes?: string[],
  dictImpacts?: string[],
) {
  const pick = (key: keyof Initiative) =>
    unique(items.map((i) => String(i[key])));
  return {
    status: STATUS_ORDER.filter((s) => pick("status").includes(s)),
    type: unique([...(dictTypes || []), ...pick("type")]),
    impact: unique([...(dictImpacts || []), ...pick("impact")]),
    effect: pick("effect"),
    effort: pick("effort"),
  };
}

export function extractInitiativeId(text: string): string | undefined {
  const m = text.match(/BI-\d{4}-\d+/);
  return m?.[0];
}

export function slaTagClass(id: string): "sla-ok" | "sla-warn" | "sla-over" {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const r = (h % 100) / 100;
  if (r < 0.6) return "sla-ok";
  if (r < 0.85) return "sla-warn";
  return "sla-over";
}

export function slaTagLabel(cls: ReturnType<typeof slaTagClass>) {
  if (cls === "sla-ok") return "В рамках SLA";
  if (cls === "sla-warn") return "Осталось < 1 дня";
  return "SLA просрочен";
}

export function isTerminalStatus(status: Status) {
  return status === "Отклонено" || status === "На доработке";
}
