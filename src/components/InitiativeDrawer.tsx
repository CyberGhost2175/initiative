"use client";

import { StatusBadge } from "@/components/StatusBadge";
import { useDemo } from "@/context/DemoContext";
import { CURRENT_USER, STATUS_META, STATUS_ORDER } from "@/lib/data";
import type { Initiative, Status } from "@/lib/types";
import { fmtDate } from "@/lib/utils";
import { useState } from "react";

export function InitiativeDrawer() {
  const { drawerId, closeDrawer, initiatives } = useDemo();
  const item = initiatives.find((x) => x.id === drawerId) || null;

  if (!drawerId || !item) return null;

  return (
    <>
      <div className="overlay show" onClick={closeDrawer} />
      <div className="drawer show">
        <DrawerBody key={`${item.id}-${item.status}`} item={item} />
      </div>
    </>
  );
}

function DrawerBody({ item }: { item: Initiative }) {
  const {
    closeDrawer,
    comments,
    addComment,
    canChangeStatus,
    changeStatus,
    role,
    resubmitInitiative,
    dictTypes,
    dictImpacts,
    showToast,
  } = useDemo();

  const isOwnerAuthor =
    role === "author" && item.author === CURRENT_USER;
  const canResubmit = isOwnerAuthor && item.status === "На доработке";

  const [commentText, setCommentText] = useState("");
  const [status, setStatus] = useState<Status>(item.status);
  const [statusComment, setStatusComment] = useState("");
  const [commentError, setCommentError] = useState(false);
  const [editing, setEditing] = useState(canResubmit);
  const [draft, setDraft] = useState({
    title: item.title,
    problem: item.problem,
    proposal: item.proposal,
    type: item.type,
    impact: item.impact,
    effect: item.effect,
    effort: item.effort,
  });

  const meta = STATUS_META[item.status];
  const passed =
    meta.step < 0
      ? (["Подана", "Модерация"] as Status[])
      : STATUS_ORDER.slice(0, meta.step + 1);
  const timeline: {
    status: Status;
    faded: boolean;
    date: string;
    note: string;
  }[] = [];
  passed.forEach((s, idx) => {
    timeline.push({
      status: s,
      faded: false,
      date: idx === passed.length - 1 ? fmtDate(item.date) : "",
      note: "",
    });
  });
  if (meta.step < 0) {
    timeline.push({
      status: item.status,
      faded: false,
      date: fmtDate(item.date),
      note: item.rejectReason || "",
    });
  }
  const list = comments[item.id] || [];
  const needsReason = status === "Отклонено" || status === "На доработке";

  return (
    <>
      <div className="drawer-head">
        <div>
          <div className="init-id">{item.id}</div>
          <h2>{item.title}</h2>
        </div>
        <button type="button" className="drawer-close" onClick={closeDrawer}>
          ✕
        </button>
      </div>
      <div className="drawer-body">
        <div className="dtag-row">
          <StatusBadge status={item.status} />
          <span className="pill-soft">{item.type}</span>
          <span className="pill-soft">{item.impact}</span>
        </div>

        {item.rejectReason && item.status === "На доработке" ? (
          <div className="rework-banner">
            <strong>Комментарий к доработке:</strong> {item.rejectReason}
          </div>
        ) : null}

        {editing ? (
          <div className="dsection">
            <h4>Доработка заявки</h4>
            <div className="field">
              <label>Название</label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label>Проблема / возможность</label>
              <textarea
                value={draft.problem}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, problem: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label>Предложение</label>
              <textarea
                value={draft.proposal}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, proposal: e.target.value }))
                }
              />
            </div>
            <div className="kv-grid" style={{ marginBottom: 12 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Тип</label>
                <select
                  value={draft.type}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, type: e.target.value }))
                  }
                >
                  {dictTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Влияние</label>
                <select
                  value={draft.impact}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, impact: e.target.value }))
                  }
                >
                  {dictImpacts.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Эффект</label>
                <select
                  value={draft.effect}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, effect: e.target.value }))
                  }
                >
                  <option>Минимальный</option>
                  <option>Средний</option>
                  <option>Максимальный</option>
                </select>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Трудозатраты</label>
                <select
                  value={draft.effort}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, effort: e.target.value }))
                  }
                >
                  <option>Минимальные</option>
                  <option>Средние</option>
                  <option>Максимальные</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => {
                if (
                  !draft.title.trim() ||
                  !draft.problem.trim() ||
                  !draft.proposal.trim()
                ) {
                  showToast("Заполните название, проблему и предложение");
                  return;
                }
                resubmitInitiative(item.id, {
                  title: draft.title.trim(),
                  problem: draft.problem.trim(),
                  proposal: draft.proposal.trim(),
                  type: draft.type,
                  impact: draft.impact,
                  effect: draft.effect,
                  effort: draft.effort,
                });
                setEditing(false);
              }}
            >
              Отправить снова на модерацию
            </button>
          </div>
        ) : (
          <>
            <div className="dsection">
              <h4>Проблема / возможность</h4>
              <p>{item.problem}</p>
            </div>
            <div className="dsection">
              <h4>Предложение</h4>
              <p>{item.proposal}</p>
            </div>
          </>
        )}

        <div className="dsection">
          <h4>Параметры</h4>
          <div className="kv-grid">
            <div>
              <div className="k">Автор</div>
              <div className="v">{item.author}</div>
            </div>
            <div>
              <div className="k">Проект</div>
              <div className="v">{item.project}</div>
            </div>
            <div>
              <div className="k">Куратор</div>
              <div className="v">{item.curator || "—"}</div>
            </div>
            <div>
              <div className="k">Создана</div>
              <div className="v">{fmtDate(item.date)}</div>
            </div>
          </div>
        </div>

        {item.attachments?.length ? (
          <div className="dsection">
            <h4>Вложения</h4>
            <div className="file-chips">
              {item.attachments.map((f) => (
                <button
                  type="button"
                  className="chip"
                  key={f}
                  onClick={() => showToast(`Демо: скачивание «${f}» недоступно`)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="dsection">
          <h4>История статуса</h4>
          <div className="timeline">
            {[...timeline].reverse().map((it, idx) => (
              <div
                className={`tl-item${idx === 0 ? "" : " faded"}`}
                key={`${it.status}-${idx}`}
              >
                <div className="tl-dot" />
                <div className="tl-top">
                  <span className="tl-status">{it.status}</span>
                  <span className="tl-date">{it.date}</span>
                </div>
                {it.note ? <div className="tl-note">{it.note}</div> : null}
                <div className="tl-actor">
                  {item.curator && item.curator !== "—"
                    ? `Куратор: ${item.curator}`
                    : ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dsection">
          <h4>Комментарии</h4>
          {list.length ? (
            list.map((c, idx) => (
              <div className="comment" key={`${c.author}-${idx}`}>
                <div className="c-top">
                  <span className="c-author">{c.author}</span>
                  <span className="c-time">{c.time}</span>
                </div>
                <div className="c-text">{c.text}</div>
              </div>
            ))
          ) : (
            <div className="comment-empty">Комментариев пока нет</div>
          )}
          <div className="comment-add">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Добавить комментарий…"
            />
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                const val = commentText.trim();
                if (!val) return;
                addComment(item.id, val);
                setCommentText("");
              }}
            >
              Отправить
            </button>
          </div>
        </div>

        <div className="dsection">
          <h4>AI-модерация</h4>
          <div className="ai-block">
            <div className="ai-head">
              ✨ Задел на AI-модерацию{" "}
              <span className="phase-chip">Фаза 3</span>
            </div>
            {[
              "Автокатегория и теги",
              "Поиск дублей и похожих инициатив",
              "Проверка полноты заполнения",
              "AI-резюме для Product Team",
              "Предварительный скоринг",
            ].map((label) => (
              <button
                type="button"
                className="ai-row ai-row-btn"
                key={label}
                onClick={() => showToast(`${label}: демо-заглушка фазы 3`)}
              >
                <span>{label}</span>
                <span className="val">заглушка</span>
              </button>
            ))}
          </div>
        </div>

        <div className="dsection">
          {canResubmit && !editing ? (
            <button
              type="button"
              className="btn btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                marginBottom: 12,
              }}
              onClick={() => setEditing(true)}
            >
              Доработать и отправить снова
            </button>
          ) : null}

          {canChangeStatus ? (
            <>
              <h4>Сменить статус</h4>
              <div className="status-change-box">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <textarea
                  className={needsReason ? "show" : ""}
                  value={statusComment}
                  onChange={(e) => {
                    setStatusComment(e.target.value);
                    setCommentError(false);
                  }}
                  placeholder="Комментарий (обязателен для «Отклонено» и «На доработке»)"
                  style={
                    commentError ? { borderColor: "var(--red)" } : undefined
                  }
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => {
                    if (needsReason && !statusComment.trim()) {
                      setCommentError(true);
                      return;
                    }
                    changeStatus(
                      item.id,
                      status,
                      needsReason ? statusComment.trim() : undefined,
                    );
                  }}
                >
                  Применить
                </button>
              </div>
            </>
          ) : !canResubmit ? (
            <div className="role-gate-note">
              Смена статуса доступна куратору, владельцу инициативы, экспертной
              комиссии или администратору.
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
