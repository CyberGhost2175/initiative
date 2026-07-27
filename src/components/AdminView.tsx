"use client";

import { useDemo } from "@/context/DemoContext";
import { useState } from "react";

const ROLE_ROWS = [
  [
    "Автор идеи",
    "Любой сотрудник, инициирует инициативу",
    "Подаёт заявку, отслеживает статус, дорабатывает по комментариям",
  ],
  [
    "Куратор",
    "Первичная проверка",
    "Модерация, определение категории, назначение ответственного",
  ],
  [
    "Экспертная комиссия",
    "Группа лиц",
    "Отклонить / доработать / бэклог / пилот",
  ],
  ["Owner", "Ответственный за этап", "Сопровождает инициативу, обновляет статус"],
  [
    "Product Team",
    "Продуктовая команда",
    "Проработка в спринте, защита решения, запуск пилота",
  ],
  [
    "Руководитель блока",
    "Наблюдатель за портфелем",
    "Просматривает витрину блока, приоритизирует бэклог",
  ],
  [
    "Топ-менеджмент",
    "Потребитель аналитики",
    "Смотрит воронку, конверсию, вклад подразделений",
  ],
  [
    "Администратор",
    "Настройка справочников и прав",
    "Управляет справочниками, ролями, SLA-нормативами",
  ],
];

export function AdminView() {
  const {
    dictTypes,
    dictImpacts,
    slaRows,
    addDictType,
    removeDictType,
    addDictImpact,
    removeDictImpact,
    updateSlaDays,
    showToast,
  } = useDemo();

  const [typeDraft, setTypeDraft] = useState("");
  const [impactDraft, setImpactDraft] = useState("");

  return (
    <section className="view active">
      <div className="page-head">
        <div>
          <h1>Администрирование</h1>
          <p>Справочники, роли и SLA — кликабельный демо-макет без бэкенда</p>
        </div>
      </div>
      <div className="analytics-banner">
        ⓘ Изменения справочников сразу влияют на форму подачи. Данные только в
        памяти браузера.
      </div>

      <div className="admin-section">
        <h2>Справочник: типы инициатив</h2>
        <p className="desc">Используется в форме подачи и фильтрах витрины</p>
        <div className="chip-row">
          {dictTypes.map((t) => (
            <span className="chip" key={t}>
              {t}
              <span className="x" onClick={() => removeDictType(t)}>
                ✕
              </span>
            </span>
          ))}
        </div>
        <div className="admin-add-row">
          <input
            type="text"
            value={typeDraft}
            placeholder="Новый тип…"
            onChange={(e) => setTypeDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addDictType(typeDraft);
                setTypeDraft("");
              }
            }}
          />
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => {
              addDictType(typeDraft);
              setTypeDraft("");
            }}
          >
            + Добавить
          </button>
        </div>
      </div>

      <div className="admin-section">
        <h2>Справочник: влияние</h2>
        <p className="desc">На кого влияет инициатива</p>
        <div className="chip-row">
          {dictImpacts.map((t) => (
            <span className="chip" key={t}>
              {t}
              <span className="x" onClick={() => removeDictImpact(t)}>
                ✕
              </span>
            </span>
          ))}
        </div>
        <div className="admin-add-row">
          <input
            type="text"
            value={impactDraft}
            placeholder="Новая категория влияния…"
            onChange={(e) => setImpactDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addDictImpact(impactDraft);
                setImpactDraft("");
              }
            }}
          />
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => {
              addDictImpact(impactDraft);
              setImpactDraft("");
            }}
          >
            + Добавить
          </button>
        </div>
      </div>

      <div className="admin-section">
        <h2>Роли и права доступа</h2>
        <p className="desc">
          Справочно по ТЗ. Переключение ролей — в шапке (демо).
        </p>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Роль</th>
              <th>Описание</th>
              <th>Ключевые действия</th>
            </tr>
          </thead>
          <tbody>
            {ROLE_ROWS.map((r) => (
              <tr
                key={r[0]}
                className="admin-role-row"
                onClick={() =>
                  showToast(`Роль «${r[0]}»: переключите в шапке демо`)
                }
              >
                <td className="strong">{r[0]}</td>
                <td>{r[1]}</td>
                <td>{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-section">
        <h2>SLA-нормативы по этапам</h2>
        <p className="desc">
          Меняйте дни — в демо сохранится в памяти и покажет уведомление
        </p>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Этап</th>
              <th>Норматив, дней</th>
              <th>Эскалация</th>
            </tr>
          </thead>
          <tbody>
            {slaRows.map((r) => (
              <tr key={r.stage}>
                <td className="strong">{r.stage}</td>
                <td>
                  <input
                    className="sla-input"
                    type="number"
                    min={1}
                    value={r.days}
                    onChange={(e) => {
                      const days = Math.max(1, Number(e.target.value) || 1);
                      updateSlaDays(r.stage, days);
                    }}
                  />
                </td>
                <td>{r.escalate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
