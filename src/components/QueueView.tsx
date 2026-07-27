"use client";

import { KanbanBoard } from "@/components/KanbanBoard";
import { useDemo } from "@/context/DemoContext";
import type { Status } from "@/lib/types";
import { slaTagClass, slaTagLabel } from "@/lib/utils";
import { useMemo, useState } from "react";

type DisplayMode = "list" | "kanban";

const CURATOR_COLUMNS: Status[] = [
  "Подана",
  "Модерация",
  "Скоринг",
  "Бэклог",
  "На доработке",
  "Отклонено",
];

export function QueueView() {
  const { queue, initiatives, openDrawer, askReason, moderate } = useDemo();
  const [mode, setMode] = useState<DisplayMode>("kanban");

  const kanbanItems = useMemo(
    () => initiatives.filter((i) => CURATOR_COLUMNS.includes(i.status)),
    [initiatives],
  );

  return (
    <section className="view active">
      <div className="page-head">
        <div>
          <h1>Очередь модерации</h1>
          <p>Новые заявки и канбан первичной проверки куратором</p>
        </div>
        <div className="view-toggle" role="group" aria-label="Режим отображения">
          <button
            type="button"
            className={`view-toggle-btn${mode === "list" ? " active" : ""}`}
            onClick={() => setMode("list")}
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
            Список
          </button>
          <button
            type="button"
            className={`view-toggle-btn${mode === "kanban" ? " active" : ""}`}
            onClick={() => setMode("kanban")}
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <rect x="2.5" y="3.5" width="4.5" height="13" rx="1" />
              <rect x="8" y="3.5" width="4.5" height="9" rx="1" />
              <rect x="13.5" y="3.5" width="4" height="11" rx="1" />
            </svg>
            Канбан
          </button>
        </div>
      </div>

      {mode === "kanban" ? (
        kanbanItems.length === 0 ? (
          <div className="table-card">
            <div className="empty-state">
              <p>Нет заявок на модерации и смежных этапах</p>
            </div>
          </div>
        ) : (
          <KanbanBoard
            items={kanbanItems}
            columns={CURATOR_COLUMNS}
            hint="Канбан куратора: перетащите в «Скоринг», «На доработку» или «Отклонено». Клик — карточка."
          />
        )
      ) : queue.length === 0 ? (
        <div className="table-card">
          <div className="empty-state">
            <p>Очередь пуста — все заявки обработаны</p>
          </div>
        </div>
      ) : (
        queue.map((i) => {
          const cls = slaTagClass(i.id);
          return (
            <div
              className="queue-card"
              key={i.id}
              onClick={() => openDrawer(i.id)}
            >
              <div className="qmain">
                <h3>{i.title}</h3>
                <div className="qmeta">
                  <span className="init-id" style={{ margin: 0 }}>
                    {i.id}
                  </span>
                  <span>{i.author}</span>
                  <span>{i.project}</span>
                  <span className="pill-soft" style={{ padding: "1px 7px" }}>
                    {i.type}
                  </span>
                  <span className={`sla-tag ${cls}`}>{slaTagLabel(cls)}</span>
                </div>
              </div>
              <div className="qactions">
                <button
                  type="button"
                  className="btn btn-sm btn-approve"
                  onClick={(e) => {
                    e.stopPropagation();
                    moderate(i.id, "approve");
                  }}
                >
                  Принять → Скоринг
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-rework"
                  onClick={(e) => {
                    e.stopPropagation();
                    askReason("Причина возврата на доработку", (reason) => {
                      moderate(i.id, "rework", reason);
                    });
                  }}
                >
                  На доработку
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-reject"
                  onClick={(e) => {
                    e.stopPropagation();
                    askReason("Причина отклонения", (reason) => {
                      moderate(i.id, "reject", reason);
                    });
                  }}
                >
                  Отклонить
                </button>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}
