"use client";

import { useDemo } from "@/context/DemoContext";
import { STATUS_META, STATUS_ORDER } from "@/lib/data";
import type { Initiative, Status } from "@/lib/types";
import { fmtDate } from "@/lib/utils";
import { useState } from "react";

const COLUMN_ACCENT: Record<Status, string> = {
  Подана: "var(--gray)",
  Модерация: "var(--gray)",
  Скоринг: "var(--amber)",
  Бэклог: "var(--amber)",
  "В работе": "var(--blue)",
  "Product Hub": "var(--purple)",
  Пилот: "var(--blue)",
  Стандарт: "var(--green)",
  Внедрение: "var(--green)",
  "На доработке": "var(--red)",
  Отклонено: "var(--red)",
};

export function KanbanBoard({
  items,
  columns = STATUS_ORDER,
  hint,
}: {
  items: Initiative[];
  columns?: Status[];
  hint?: string;
}) {
  const { openDrawer, changeStatus, askReason, canChangeStatus, moderate } =
    useDemo();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<Status | null>(null);

  function byStatus(status: Status) {
    return items.filter((i) => i.status === status);
  }

  function applyMove(id: string, status: Status) {
    const item = items.find((i) => i.id === id);
    if (!item || item.status === status) return;

    // Кураторский быстрый путь из очереди
    if (
      (item.status === "Подана" || item.status === "Модерация") &&
      status === "Скоринг"
    ) {
      moderate(id, "approve");
      return;
    }

    if (status === "Отклонено" || status === "На доработке") {
      askReason(
        status === "Отклонено"
          ? "Причина отклонения"
          : "Причина возврата на доработку",
        (reason) => {
          if (item.status === "Подана" || item.status === "Модерация") {
            moderate(
              id,
              status === "Отклонено" ? "reject" : "rework",
              reason,
            );
          } else {
            changeStatus(id, status, reason);
          }
        },
      );
      return;
    }
    changeStatus(id, status);
  }

  const defaultHint = !canChangeStatus
    ? "Просмотр канбана. Перетаскивание доступно куратору, owner, комиссии, руководителю или администратору."
    : "Перетащите карточку в другой столбец, чтобы сменить статус.";

  return (
    <div className="kanban">
      <div className="kanban-hint">{hint || defaultHint}</div>

      <div className="kanban-board">
        {columns.map((status) => {
          const cards = byStatus(status);
          const accent = COLUMN_ACCENT[status];
          const isOver = overStatus === status && draggingId !== null;

          return (
            <div
              key={status}
              className={`kanban-col${isOver ? " is-over" : ""}`}
              onDragOver={(e) => {
                if (!canChangeStatus) return;
                e.preventDefault();
                setOverStatus(status);
              }}
              onDragLeave={() => {
                setOverStatus((prev) => (prev === status ? null : prev));
              }}
              onDrop={(e) => {
                if (!canChangeStatus) return;
                e.preventDefault();
                const id =
                  e.dataTransfer.getData("text/initiative-id") || draggingId;
                setDraggingId(null);
                setOverStatus(null);
                if (id) applyMove(id, status);
              }}
            >
              <div className="kanban-col-head">
                <span
                  className="kanban-col-dot"
                  style={{ background: accent }}
                />
                <span className="kanban-col-title">{status}</span>
                <span className="kanban-col-count">{cards.length}</span>
              </div>

              <div className="kanban-col-body">
                {cards.length === 0 ? (
                  <div className="kanban-empty">
                    {isOver ? "Отпустите здесь" : "Пусто"}
                  </div>
                ) : (
                  cards.map((item) => (
                    <KanbanCard
                      key={item.id}
                      item={item}
                      draggable={canChangeStatus}
                      isDragging={draggingId === item.id}
                      onDragStart={() => setDraggingId(item.id)}
                      onDragEnd={() => {
                        setDraggingId(null);
                        setOverStatus(null);
                      }}
                      onOpen={() => openDrawer(item.id)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KanbanCard({
  item,
  draggable,
  isDragging,
  onDragStart,
  onDragEnd,
  onOpen,
}: {
  item: Initiative;
  draggable: boolean;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onOpen: () => void;
}) {
  const meta = STATUS_META[item.status];

  return (
    <article
      className={`kanban-card${isDragging ? " is-dragging" : ""}${draggable ? " is-draggable" : ""}`}
      draggable={draggable}
      onDragStart={(e) => {
        if (!draggable) return;
        e.dataTransfer.setData("text/initiative-id", item.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onClick={onOpen}
    >
      <div className="kanban-card-top">
        <span className="init-id">{item.id}</span>
        <span className={`kanban-effect ke-${meta.cls.replace("badge-", "")}`}>
          {item.effect}
        </span>
      </div>
      <h3>{item.title}</h3>
      <div className="kanban-card-meta">
        <span className="pill-soft">{item.type}</span>
        <span className="kanban-meta-text">{item.impact}</span>
      </div>
      <div className="kanban-card-foot">
        <span>{item.author}</span>
        <span>{fmtDate(item.date)}</span>
      </div>
      {draggable ? (
        <div className="kanban-grip" aria-hidden>
          ⋮⋮
        </div>
      ) : null}
    </article>
  );
}
