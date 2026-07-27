"use client";

import { useDemo } from "@/context/DemoContext";
import { STATUS_ORDER } from "@/lib/data";

export function AnalyticsView() {
  const { initiatives } = useDemo();
  const total = initiatives.length || 1;

  const counts: Record<string, number> = {};
  STATUS_ORDER.forEach((s) => {
    counts[s] = 0;
  });
  initiatives.forEach((i) => {
    counts[i.status] = (counts[i.status] || 0) + 1;
  });

  const funnelSteps = [
    "Подана",
    "Модерация",
    "Скоринг",
    "Бэклог",
    "В работе",
    "Product Hub",
    "Пилот",
    "Стандарт",
  ] as const;

  const cumulative = funnelSteps.map((_, idx) => {
    return (
      funnelSteps.slice(idx).reduce((sum, st) => sum + counts[st], 0) +
      (idx === 0 ? counts["На доработке"] + counts["Отклонено"] : 0)
    );
  });
  const max = Math.max(...cumulative, 1);

  const pilotCount =
    counts["Пилот"] + counts["Стандарт"] + counts["Внедрение"];
  const standardCount = counts["Стандарт"] + counts["Внедрение"];
  const pilotPct = Math.round((pilotCount / total) * 100);
  const standardPct = Math.round((standardCount / total) * 100);
  // Демо-оценка среднего срока: зависит от доли незавершённых
  const openShare =
    (counts["Подана"] +
      counts["Модерация"] +
      counts["Скоринг"] +
      counts["Бэклог"] +
      counts["В работе"] +
      counts["Product Hub"]) /
    total;
  const avgDays = (4.2 + openShare * 5).toFixed(1).replace(".", ",");

  const depts: Record<string, number> = {};
  initiatives.forEach((i) => {
    depts[i.project] = (depts[i.project] || 0) + 1;
  });
  const deptSorted = Object.entries(depts).sort((a, b) => b[1] - a[1]);

  return (
    <section className="view active">
      <div className="page-head">
        <div>
          <h1>Аналитика воронки</h1>
          <p>Считается по текущим демо-данным в памяти</p>
        </div>
      </div>
      <div className="analytics-banner">
        ⓘ Фаза 2 · цифры обновляются при подаче и смене статусов в этой сессии
      </div>

      <div className="analytics-grid">
        <div className="funnel">
          <h2>Воронка инициатив, все время</h2>
          {funnelSteps.map((s, idx) => {
            const val = cumulative[idx];
            const w = Math.max(8, Math.round((val / max) * 100));
            return (
              <div className="funnel-row" key={s}>
                <div className="funnel-label">{s}</div>
                <div className="funnel-bar-wrap">
                  <div className="funnel-bar" style={{ width: `${w}%` }}>
                    <span>{val}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="stat-card">
            <h3>Конверсия в пилот</h3>
            <div className="big" style={{ color: "var(--blue)" }}>
              {pilotPct}%
            </div>
            <div className="stat-sub">
              {pilotCount} из {initiatives.length}
            </div>
          </div>
          <div className="stat-card">
            <h3>Конверсия в стандарт</h3>
            <div className="big" style={{ color: "var(--green)" }}>
              {standardPct}%
            </div>
            <div className="stat-sub">
              {standardCount} из {initiatives.length}
            </div>
          </div>
          <div className="stat-card">
            <h3>Средний срок этапа</h3>
            <div className="big">{avgDays} дн.</div>
            <div className="stat-sub">демо-оценка</div>
          </div>
        </div>
      </div>

      <div className="stat-card" style={{ marginTop: 16 }}>
        <h3>Вклад подразделений</h3>
        {deptSorted.map(([name, val]) => (
          <div className="dept-row" key={name}>
            <span className="name">{name}</span>
            <span className="val">{val}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
