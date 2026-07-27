"use client";

import { ROLES } from "@/lib/data";
import { VIEW_PATHS } from "@/lib/routes";
import type { RoleId, ViewId } from "@/lib/types";
import { useDemo } from "@/context/DemoContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TABS: { id: ViewId; label: string; phase?: string }[] = [
  { id: "showcase", label: "Витрина инициатив" },
  { id: "mine", label: "Мои инициативы" },
  { id: "queue", label: "Очередь модерации" },
  { id: "analytics", label: "Аналитика", phase: "Фаза 2" },
  { id: "admin", label: "Администрирование", phase: "Фаза 2" },
];

const ROLE_ITEMS: { id: RoleId; desc: string }[] = [
  { id: "author", desc: "Подаёт заявки, следит за статусом" },
  { id: "curator", desc: "Модерация, категоризация, назначение" },
  { id: "owner", desc: "Сопровождает этап, обновляет статус" },
  { id: "commission", desc: "Отклонить / доработать / бэклог / пилот" },
  { id: "lead", desc: "Витрина отдела, приоритизация бэклога" },
  { id: "admin", desc: "Справочники, роли, SLA-нормативы" },
];

export function Header() {
  const {
    allowedTabs,
    role,
    setRole,
    roleLabel,
    openSubmit,
    notifications,
    notifUnread,
    markNotifsRead,
    openNotif,
    showToast,
  } = useDemo();

  const pathname = usePathname();
  const router = useRouter();
  const [roleOpen, setRoleOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (roleRef.current && !roleRef.current.contains(target)) {
        setRoleOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <header className="topbar">
      <Link href="/showcase" className="brand" style={{ textDecoration: "none" }}>
        <svg
          viewBox="614.62 239.67 690.75 600.65"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            fill="#27348b"
            d="M1305.37,540c0,43.9-5.96,87.79-17.99,131.68-19.71,72.58-86.51,136.79-172,153.43-51.74,10.11-103.59,15.21-155.43,15.21s-103.59-5.1-155.33-15.21c-85.6-16.64-152.4-80.85-172.11-153.43-11.93-43.9-17.89-87.79-17.89-131.68s5.96-87.79,17.89-131.69c19.71-72.58,86.51-136.79,172.11-153.43,51.74-10.11,103.59-15.21,155.33-15.21s103.69,5.1,155.43,15.21c85.5,16.64,152.3,80.85,172,153.43,12.03,43.9,17.99,87.79,17.99,131.69Z"
          />
          <path
            fill="#fff"
            d="M778.89,391.08c0-8.98,7.28-16.26,16.26-16.26h131.93c38.07,0,66.86,9.76,86.37,29.26,14.78,14.79,22.18,33.04,22.18,54.74v.95c0,10.07-1.34,18.96-4.01,26.67-2.68,7.71-6.14,14.47-10.38,20.29-4.24,5.82-9.28,10.94-15.1,15.33-5.82,4.41-11.73,8.19-17.69,11.32,9.75,3.47,18.64,7.48,26.66,12.04,8.02,4.56,14.95,10,20.77,16.28,5.82,6.29,10.31,13.69,13.45,22.18,3.14,8.5,4.72,18.41,4.72,29.73v.95c0,14.79-2.91,27.85-8.73,39.17-5.82,11.33-14.08,20.77-24.77,28.32-10.7,7.55-23.6,13.29-38.7,17.23-15.1,3.94-31.78,5.9-50.03,5.9h-136.65c-8.98,0-16.26-7.28-16.26-16.26v-297.83ZM977.58,468.26c0-13.21-4.96-23.51-14.87-30.91-9.91-7.39-24.3-11.09-43.18-11.09h-67.28c-8.98,0-16.26,7.28-16.26,16.26v55.26c0,8.98,7.28,16.26,16.26,16.26h63.03c18.87,0,33.98-3.69,45.31-11.09,11.32-7.39,16.99-18.64,16.99-33.74v-.95ZM995.99,607.49c0-14.15-5.6-25.09-16.76-32.81-11.18-7.71-28.24-11.55-51.21-11.55h-75.77c-8.98,0-16.26,7.28-16.26,16.26v58.08c0,8.98,7.28,16.26,16.26,16.26h80.02c19.82,0,35.4-3.77,46.72-11.32,11.33-7.55,17-18.87,17-33.98v-.95Z"
          />
          <path
            fill="#fff"
            d="M1099.32,374.82h25.53c8.98,0,16.26,7.28,16.26,16.26v297.83c0,8.98-7.28,16.26-16.26,16.26h-25.53c-8.98,0-16.26-7.28-16.26-16.26v-297.83c0-8.98,7.28-16.26,16.26-16.26Z"
          />
        </svg>
        <div className="brand-text">
          <span className="name">Прилёты / Отлёты</span>
        </div>
      </Link>

      <nav className="tabs" id="navTabs">
        {TABS.filter((t) => allowedTabs.includes(t.id)).map((t) => (
          <Link
            key={t.id}
            href={VIEW_PATHS[t.id]}
            className={`tab-btn${pathname === VIEW_PATHS[t.id] ? " active" : ""}`}
          >
            {t.label}
            {t.phase ? <span className="phase-chip">{t.phase}</span> : null}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            if (role !== "author" && role !== "admin") {
              showToast("В демо подача от имени автора — переключите роль");
            }
            openSubmit();
          }}
        >
          + Подать инициативу
        </button>

        <div style={{ position: "relative" }} ref={notifRef}>
          <button
            type="button"
            className="icon-btn"
            onClick={() => {
              setNotifOpen((v) => !v);
              setRoleOpen(false);
              markNotifsRead();
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.7 21a2 2 0 01-3.4 0" />
            </svg>
            {notifUnread ? <span className="dot-badge" /> : null}
          </button>
          <div
            className={`dropdown-panel notif-panel${notifOpen ? " show" : ""}`}
          >
            <div className="np-head">Уведомления</div>
            {notifications.length === 0 ? (
              <div className="np-item">
                <div className="np-text" style={{ color: "var(--muted)" }}>
                  Уведомлений пока нет
                </div>
              </div>
            ) : (
              notifications.map((n, idx) => (
                <button
                  type="button"
                  className="np-item np-item-btn"
                  key={`${n.text}-${idx}`}
                  onClick={() => {
                    openNotif(n);
                    setNotifOpen(false);
                  }}
                >
                  <div className={`np-dot ${n.type}`} />
                  <div>
                    <div className="np-text">{n.text}</div>
                    <div className="np-time">{n.time}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div style={{ position: "relative" }} ref={roleRef}>
          <button
            type="button"
            className="role-switch"
            onClick={() => {
              setRoleOpen((v) => !v);
              setNotifOpen(false);
            }}
          >
            <div className="avatar">ДС</div>
            <div className="rs-text">
              <span className="name">Данияр С.</span>
              <span className="role">{roleLabel}</span>
            </div>
            <svg
              className="chev"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M5 7l5 5 5-5" />
            </svg>
          </button>
          <div
            className={`dropdown-panel role-panel${roleOpen ? " show" : ""}`}
          >
            {ROLE_ITEMS.map((r) => (
              <div
                key={r.id}
                className={`rp-item${role === r.id ? " active" : ""}`}
                onClick={() => {
                  setRole(r.id);
                  setRoleOpen(false);
                  router.push(VIEW_PATHS[ROLES[r.id].default]);
                }}
              >
                <span className="rn">{ROLES[r.id].label}</span>
                <span className="rd">{r.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
