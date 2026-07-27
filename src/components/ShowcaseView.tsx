"use client";

import { KanbanBoard } from "@/components/KanbanBoard";
import { StatusBadge } from "@/components/StatusBadge";
import { useDemo } from "@/context/DemoContext";
import { USER_DEPT } from "@/lib/data";
import { filterOptions, fmtDate } from "@/lib/utils";
import { useState } from "react";

type DisplayMode = "list" | "kanban";

export function ShowcaseView() {
  const {
    scoped,
    filtered,
    filters,
    setFilters,
    resetFilters,
    activeCounter,
    setActiveCounter,
    openDrawer,
    dictTypes,
    dictImpacts,
  } = useDemo();

  const [mode, setMode] = useState<DisplayMode>("list");
  const options = filterOptions(scoped, dictTypes, dictImpacts);

  const total = scoped.length;
  const backlog = scoped.filter((i) => i.status === "Бэклог").length;
  const progress = scoped.filter((i) =>
    ["В работе", "Product Hub", "Пилот"].includes(i.status),
  ).length;
  const done = scoped.filter((i) =>
    ["Стандарт", "Внедрение"].includes(i.status),
  ).length;
  const rejected = scoped.filter((i) =>
    ["Отклонено", "На доработке"].includes(i.status),
  ).length;

  const counters = [
    { cls: "c-total", num: total, lbl: "Всего идей" },
    { cls: "c-backlog", num: backlog, lbl: "В бэклоге" },
    { cls: "c-progress", num: progress, lbl: "В работе" },
    { cls: "c-done", num: done, lbl: "Реализовано" },
    { cls: "c-rejected", num: rejected, lbl: "Отклонено" },
  ];

  function onCounterClick(cls: string) {
    if (cls === "c-total") {
      setActiveCounter(null);
      setFilters({ status: "", statusGroup: "" });
      return;
    }
    setActiveCounter(cls);
    if (cls === "c-backlog") {
      setFilters({ status: "Бэклог", statusGroup: "" });
    }
    if (cls === "c-progress") {
      setFilters({ status: "", statusGroup: "progress" });
    }
    if (cls === "c-done") {
      setFilters({ status: "", statusGroup: "done" });
    }
    if (cls === "c-rejected") {
      setFilters({ status: "", statusGroup: "rejected" });
    }
  }

  return (
    <section className="view active">
      <div className="page-head">
        <div>
          <h1>Витрина инициатив</h1>
          <p>Инициативы отдела «{USER_DEPT}» — с фильтрами и приоритетом</p>
        </div>
        <div className="view-toggle" role="group" aria-label="Режим отображения">
          <button
            type="button"
            className={`view-toggle-btn${mode === "list" ? " active" : ""}`}
            onClick={() => setMode("list")}
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
            Список
          </button>
          <button
            type="button"
            className={`view-toggle-btn${mode === "kanban" ? " active" : ""}`}
            onClick={() => setMode("kanban")}
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
              <rect x="2.5" y="3.5" width="4.5" height="13" rx="1" />
              <rect x="8" y="3.5" width="4.5" height="9" rx="1" />
              <rect x="13.5" y="3.5" width="4" height="11" rx="1" />
            </svg>
            Канбан
          </button>
        </div>
      </div>

      <div className="counters">
        {counters.map((c) => (
          <div
            key={c.cls}
            className={`counter-card ${c.cls}${activeCounter === c.cls ? " active" : ""}`}
            onClick={() => onCounterClick(c.cls)}
          >
            <div className="num">{c.num}</div>
            <div className="lbl">{c.lbl}</div>
          </div>
        ))}
      </div>

      <div className="filters">
        <div className="search">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <circle cx="9" cy="9" r="6.2" />
            <path d="M17 17l-4-4" />
          </svg>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            placeholder="Поиск по названию, автору, проекту…"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => {
            setActiveCounter(null);
            setFilters({ status: e.target.value, statusGroup: "" });
          }}
        >
          <option value="">Статус: все</option>
          {options.status.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ type: e.target.value })}
        >
          <option value="">Тип: все</option>
          {options.type.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <select
          value={filters.impact}
          onChange={(e) => setFilters({ impact: e.target.value })}
        >
          <option value="">Влияние: все</option>
          {options.impact.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <select
          value={filters.effect}
          onChange={(e) => setFilters({ effect: e.target.value })}
        >
          <option value="">Эффект: все</option>
          {options.effect.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <select
          value={filters.effort}
          onChange={(e) => setFilters({ effort: e.target.value })}
        >
          <option value="">Трудозатраты: все</option>
          {options.effort.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <button type="button" className="reset" onClick={resetFilters}>
          Сбросить фильтры
        </button>
      </div>

      {mode === "kanban" ? (
        filtered.length === 0 ? (
          <div className="table-card">
            <div className="empty-state">
              <p>Ничего не найдено — попробуйте изменить фильтры</p>
            </div>
          </div>
        ) : (
          <KanbanBoard items={filtered} />
        )
      ) : (
        <div className="table-card">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <p>Ничего не найдено — попробуйте изменить фильтры</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Инициатива</th>
                  <th>Тип</th>
                  <th>Влияние</th>
                  <th>Автор</th>
                  <th>Проект</th>
                  <th>Статус</th>
                  <th>Эффект</th>
                  <th>Трудозатраты</th>
                  <th>Создана</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i.id} onClick={() => openDrawer(i.id)}>
                    <td>
                      <div className="init-title">{i.title}</div>
                      <div className="init-id">{i.id}</div>
                    </td>
                    <td>
                      <span className="pill-soft">{i.type}</span>
                    </td>
                    <td>{i.impact}</td>
                    <td>{i.author}</td>
                    <td>{i.project}</td>
                    <td>
                      <StatusBadge status={i.status} />
                    </td>
                    <td>{i.effect}</td>
                    <td>{i.effort}</td>
                    <td>{fmtDate(i.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}
