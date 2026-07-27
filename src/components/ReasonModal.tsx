"use client";

import { useDemo } from "@/context/DemoContext";
import { useState } from "react";

export function ReasonModal() {
  const { reason, closeReason, reasonKey } = useDemo();
  if (!reason) return null;

  return (
    <div
      className="modal-overlay show"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeReason();
      }}
    >
      <div className="modal" style={{ width: 440 }}>
        <ReasonForm key={reasonKey} title={reason.title} onConfirm={reason.onConfirm} />
      </div>
    </div>
  );
}

function ReasonForm({
  title,
  onConfirm,
}: {
  title: string;
  onConfirm: (reason: string) => void;
}) {
  const { closeReason } = useDemo();
  const [text, setText] = useState("");
  const [error, setError] = useState(false);

  return (
    <>
      <div className="modal-head">
        <h2>{title}</h2>
        <button type="button" className="drawer-close" onClick={closeReason}>
          ✕
        </button>
      </div>
      <div className="modal-body">
        <div className="field">
          <label>
            Комментарий для автора <span className="req">*</span>
          </label>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError(false);
            }}
            placeholder="Например: дубликат инициативы BI-2026-0091"
            style={error ? { borderColor: "var(--red)" } : undefined}
          />
        </div>
      </div>
      <div className="modal-foot" style={{ justifyContent: "flex-end" }}>
        <button type="button" className="btn btn-ghost" onClick={closeReason}>
          Отмена
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            const val = text.trim();
            if (!val) {
              setError(true);
              return;
            }
            onConfirm(val);
            closeReason();
          }}
        >
          Подтвердить
        </button>
      </div>
    </>
  );
}
