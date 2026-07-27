"use client";

import { useDemo } from "@/context/DemoContext";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type FormState = {
  title: string;
  problem: string;
  proposal: string;
  type: string;
  impact: string;
  effect: string;
  effort: string;
};

const empty: FormState = {
  title: "",
  problem: "",
  proposal: "",
  type: "",
  impact: "",
  effect: "",
  effort: "",
};

const FIELD_ERRORS: Record<keyof FormState, string> = {
  title: "Укажите название идеи",
  problem: "Опишите проблему или возможность",
  proposal: "Опишите предложение",
  type: "Выберите тип инициативы",
  impact: "Укажите, на кого влияет",
  effect: "Укажите ожидаемый эффект",
  effort: "Укажите трудозатраты",
};

export function SubmitModal() {
  const { submitOpen, closeSubmit, submitKey } = useDemo();
  if (!submitOpen) return null;

  return (
    <div
      className="modal-overlay show"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSubmit();
      }}
    >
      <div className="modal">
        <SubmitForm key={submitKey} />
      </div>
    </div>
  );
}

function SubmitForm() {
  const {
    closeSubmit,
    submitInitiative,
    dictTypes,
    dictImpacts,
    openDrawer,
  } = useDemo();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [files, setFiles] = useState<string[]>([]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});
  const [successId, setSuccessId] = useState<string | null>(null);

  function patch<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  }

  function validate() {
    const next: Partial<Record<keyof FormState, boolean>> = {};
    (Object.keys(empty) as (keyof FormState)[]).forEach((key) => {
      if (!form[key].trim()) next[key] = true;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit() {
    if (!validate()) return;
    const id = submitInitiative({
      title: form.title.trim(),
      problem: form.problem.trim(),
      proposal: form.proposal.trim(),
      type: form.type,
      impact: form.impact,
      effect: form.effect,
      effort: form.effort,
      attachments: files,
    });
    setSuccessId(id);
  }

  if (successId) {
    return (
      <div className="success-view">
        <div className="success-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2>Заявка принята</h2>
        <p>
          Инициатива создана со статусом «Подана» и поставлена в очередь
          модерации
        </p>
        <div className="success-id">{successId}</div>
        <div className="success-actions">
          <button type="button" className="btn btn-outline" onClick={closeSubmit}>
            Закрыть
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              closeSubmit();
              openDrawer(successId);
            }}
          >
            Открыть карточку
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              closeSubmit();
              router.push("/mine");
            }}
          >
            Мои инициативы
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="modal-head">
        <div>
          <h2>Подать инициативу</h2>
          <div className="time-hint">
            ≈ 3 минуты · SSO BI Life (демо-заглушка)
          </div>
        </div>
        <button type="button" className="drawer-close" onClick={closeSubmit}>
          ✕
        </button>
      </div>
      <div className="modal-body">
        <Field
          label="Название идеи"
          required
          error={errors.title}
          errorText={FIELD_ERRORS.title}
        >
          <input
            type="text"
            value={form.title}
            onChange={(e) => patch("title", e.target.value)}
            placeholder="Коротко и по сути"
          />
        </Field>
        <Field
          label="Какую проблему или возможность решает"
          required
          error={errors.problem}
          errorText={FIELD_ERRORS.problem}
        >
          <textarea
            value={form.problem}
            onChange={(e) => patch("problem", e.target.value)}
            placeholder="Опишите текущую ситуацию и её недостатки"
          />
        </Field>
        <Field
          label="Что вы предлагаете сделать"
          required
          error={errors.proposal}
          errorText={FIELD_ERRORS.proposal}
        >
          <textarea
            value={form.proposal}
            onChange={(e) => patch("proposal", e.target.value)}
            placeholder="Суть предложения в 2–3 предложениях"
          />
        </Field>
        <Field
          label="Тип инициативы"
          required
          error={errors.type}
          errorText={FIELD_ERRORS.type}
        >
          <select
            value={form.type}
            onChange={(e) => patch("type", e.target.value)}
          >
            <option value="">Выберите тип</option>
            {dictTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field
          label="Влияние — на кого влияет"
          required
          error={errors.impact}
          errorText={FIELD_ERRORS.impact}
        >
          <select
            value={form.impact}
            onChange={(e) => patch("impact", e.target.value)}
          >
            <option value="">Выберите влияние</option>
            {dictImpacts.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field
          label="Ожидаемый эффект"
          required
          error={errors.effect}
          errorText={FIELD_ERRORS.effect}
        >
          <select
            value={form.effect}
            onChange={(e) => patch("effect", e.target.value)}
          >
            <option value="">Выберите эффект</option>
            <option>Минимальный</option>
            <option>Средний</option>
            <option>Максимальный</option>
          </select>
        </Field>
        <Field
          label="Трудозатраты на ваш взгляд"
          required
          error={errors.effort}
          errorText={FIELD_ERRORS.effort}
        >
          <select
            value={form.effort}
            onChange={(e) => patch("effort", e.target.value)}
          >
            <option value="">Выберите трудозатраты</option>
            <option>Минимальные</option>
            <option>Средние</option>
            <option>Максимальные</option>
          </select>
        </Field>
        <div className="field">
          <label>
            Вложения <span className="opt">(опционально · демо)</span>
          </label>
          <input
            ref={fileRef}
            type="file"
            multiple
            hidden
            onChange={(e) => {
              const names = Array.from(e.target.files || []).map((f) => f.name);
              if (names.length) {
                setFiles((prev) => uniqueNames([...prev, ...names]));
              }
              e.target.value = "";
            }}
          />
          <button
            type="button"
            className="file-drop"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const names = Array.from(e.dataTransfer.files).map((f) => f.name);
              if (names.length) setFiles((prev) => uniqueNames([...prev, ...names]));
            }}
          >
            Перетащите файл сюда или нажмите, чтобы выбрать
            <span className="file-drop-sub">Файлы не загружаются на сервер</span>
          </button>
          {files.length ? (
            <div className="file-chips">
              {files.map((name) => (
                <span className="chip" key={name}>
                  {name}
                  <span
                    className="x"
                    onClick={() =>
                      setFiles((prev) => prev.filter((f) => f !== name))
                    }
                  >
                    ✕
                  </span>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="modal-foot">
        <div className="step-dots" title="Демо-индикатор заполнения">
          <span className={form.title ? "on" : undefined} />
          <span className={form.problem && form.proposal ? "on" : undefined} />
          <span
            className={
              form.type && form.impact && form.effect && form.effort
                ? "on"
                : undefined
            }
          />
          <span className={files.length ? "on" : undefined} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="btn btn-ghost" onClick={closeSubmit}>
            Отмена
          </button>
          <button type="button" className="btn btn-primary" onClick={onSubmit}>
            Отправить на модерацию
          </button>
        </div>
      </div>
    </div>
  );
}

function uniqueNames(arr: string[]) {
  return [...new Set(arr)];
}

function Field({
  label,
  required,
  error,
  errorText,
  children,
}: {
  label: string;
  required?: boolean;
  error?: boolean;
  errorText?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <label>
        {label} {required ? <span className="req">*</span> : null}
      </label>
      {children}
      {errorText ? <div className="err">{errorText}</div> : null}
    </div>
  );
}
