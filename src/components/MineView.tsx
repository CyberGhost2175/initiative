"use client";

import { StatusBadge } from "@/components/StatusBadge";
import { useDemo } from "@/context/DemoContext";
import { STATUS_META } from "@/lib/data";
import { fmtDate } from "@/lib/utils";

export function MineView() {
  const { mine, openDrawer, openSubmit } = useDemo();

  return (
    <section className="view active">
      <div className="page-head">
        <div>
          <h1>Мои инициативы</h1>
          <p>
            Личный кабинет — статус и история. Заявки «На доработке» можно
            отправить снова.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openSubmit}>
          + Подать инициативу
        </button>
      </div>
      {mine.length === 0 ? (
        <div className="table-card">
          <div className="empty-state">
            <p>Пока нет заявок — подайте первую инициативу</p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: 14 }}
              onClick={openSubmit}
            >
              Подать инициативу
            </button>
          </div>
        </div>
      ) : (
        <div className="my-grid">
          {mine.map((i) => {
            const meta = STATUS_META[i.status];
            const pct =
              meta.step < 0 ? 100 : Math.round(((meta.step + 1) / 9) * 100);
            return (
              <div
                key={i.id}
                className="my-card"
                onClick={() => openDrawer(i.id)}
              >
                <div className="top-row">
                  <div>
                    <div className="init-id">{i.id}</div>
                    <h3>{i.title}</h3>
                  </div>
                  <StatusBadge status={i.status} />
                </div>
                {i.status === "На доработке" && i.rejectReason ? (
                  <div className="my-rework-note">{i.rejectReason}</div>
                ) : null}
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${pct}%`,
                      ...(meta.step < 0
                        ? { background: "var(--red)" }
                        : {}),
                    }}
                  />
                </div>
                <div className="meta-row">
                  <span>
                    {i.status === "На доработке"
                      ? "Нажмите, чтобы доработать"
                      : i.project}
                  </span>
                  <span>{fmtDate(i.date)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
