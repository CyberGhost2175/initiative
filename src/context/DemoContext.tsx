"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CAN_CHANGE_STATUS,
  CURRENT_USER,
  INITIAL_COMMENTS,
  INITIAL_INITIATIVES,
  INITIAL_NOTIFICATIONS,
  ROLES,
  USER_DEPT,
} from "@/lib/data";
import type {
  Comment,
  Filters,
  Initiative,
  NotificationItem,
  ResubmitPayload,
  RoleId,
  SlaRow,
  Status,
  SubmitPayload,
  ToastItem,
  ViewId,
} from "@/lib/types";
import {
  deptInitiatives,
  extractInitiativeId,
  filterInitiatives,
  nextInitiativeId,
} from "@/lib/utils";

const emptyFilters: Filters = {
  search: "",
  status: "",
  statusGroup: "",
  type: "",
  impact: "",
  effect: "",
  effort: "",
};

const INITIAL_TYPES = [
  "Продукт",
  "Процесс",
  "Сервис",
  "Улучшение стандарта",
  "Прочее",
];

const INITIAL_IMPACTS = ["Клиент", "Сотрудник", "Проект", "Эксплуатация"];

const INITIAL_SLA: SlaRow[] = [
  { stage: "Модерация", days: 1, escalate: "Куратору" },
  { stage: "Скоринг", days: 3, escalate: "Ответственному за скоринг" },
  { stage: "Бэклог → В работе", days: 10, escalate: "Руководителю блока" },
  { stage: "В работе", days: 20, escalate: "Owner'у и Product Hub" },
  { stage: "Product Hub", days: 5, escalate: "Экспертной комиссии" },
  { stage: "Пилот (MVP)", days: 30, escalate: "Product Team" },
];

type DemoContextValue = {
  initiatives: Initiative[];
  comments: Record<string, Comment[]>;
  notifications: NotificationItem[];
  notifUnread: boolean;
  role: RoleId;
  filters: Filters;
  activeCounter: string | null;
  drawerId: string | null;
  submitOpen: boolean;
  submitKey: number;
  reason: { title: string; onConfirm: (reason: string) => void } | null;
  reasonKey: number;
  roleLabel: string;
  allowedTabs: ViewId[];
  canChangeStatus: boolean;
  isAuthor: boolean;
  scoped: Initiative[];
  filtered: Initiative[];
  mine: Initiative[];
  queue: Initiative[];
  dictTypes: string[];
  dictImpacts: string[];
  slaRows: SlaRow[];
  toasts: ToastItem[];
  setRole: (role: RoleId) => void;
  setFilters: (patch: Partial<Filters>) => void;
  resetFilters: () => void;
  setActiveCounter: (cls: string | null) => void;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
  openSubmit: () => void;
  closeSubmit: () => void;
  markNotifsRead: () => void;
  openNotif: (n: NotificationItem) => void;
  pushNotif: (
    type: NotificationItem["type"],
    text: string,
    initiativeId?: string,
  ) => void;
  showToast: (text: string) => void;
  dismissToast: (id: number) => void;
  submitInitiative: (payload: SubmitPayload) => string;
  resubmitInitiative: (id: string, payload: ResubmitPayload) => void;
  addComment: (id: string, text: string) => void;
  changeStatus: (id: string, status: Status, reason?: string) => void;
  askReason: (title: string, onConfirm: (reason: string) => void) => void;
  closeReason: () => void;
  moderate: (
    id: string,
    act: "approve" | "rework" | "reject",
    reason?: string,
  ) => void;
  addDictType: (value: string) => void;
  removeDictType: (value: string) => void;
  addDictImpact: (value: string) => void;
  removeDictImpact: (value: string) => void;
  updateSlaDays: (stage: string, days: number) => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [initiatives, setInitiatives] = useState(INITIAL_INITIATIVES);
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [notifications, setNotifications] = useState(() =>
    INITIAL_NOTIFICATIONS.map((n) => ({
      ...n,
      initiativeId: extractInitiativeId(n.text),
    })),
  );
  const [notifUnread, setNotifUnread] = useState(true);
  const [role, setRoleState] = useState<RoleId>("author");
  const [filters, setFiltersState] = useState<Filters>(emptyFilters);
  const [activeCounter, setActiveCounter] = useState<string | null>(null);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitKey, setSubmitKey] = useState(0);
  const [reason, setReason] = useState<DemoContextValue["reason"]>(null);
  const [reasonKey, setReasonKey] = useState(0);
  const [dictTypes, setDictTypes] = useState(INITIAL_TYPES);
  const [dictImpacts, setDictImpacts] = useState(INITIAL_IMPACTS);
  const [slaRows, setSlaRows] = useState(INITIAL_SLA);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((text: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, text }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setRole = useCallback((next: RoleId) => {
    setRoleState(next);
  }, []);

  const setFilters = useCallback((patch: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(emptyFilters);
    setActiveCounter(null);
  }, []);

  const pushNotif = useCallback(
    (
      type: NotificationItem["type"],
      text: string,
      initiativeId?: string,
    ) => {
      setNotifications((prev) => [
        {
          type,
          text,
          time: "только что",
          initiativeId: initiativeId || extractInitiativeId(text),
        },
        ...prev,
      ]);
      setNotifUnread(true);
    },
    [],
  );

  const submitInitiative = useCallback(
    (payload: SubmitPayload) => {
      const id = nextInitiativeId(initiatives);
      const today = new Date().toISOString().slice(0, 10);
      const item: Initiative = {
        id,
        title: payload.title,
        type: payload.type,
        impact: payload.impact,
        author: CURRENT_USER,
        dept: USER_DEPT,
        project: "Новые инициативы",
        status: "Подана",
        effect: payload.effect,
        effort: payload.effort,
        date: today,
        problem: payload.problem,
        proposal: payload.proposal,
        curator: "—",
        attachments: payload.attachments?.length
          ? payload.attachments
          : undefined,
      };
      setInitiatives((prev) => [item, ...prev]);
      pushNotif(
        "blue",
        `Новая заявка ${id} поступила на модерацию`,
        id,
      );
      showToast(`Заявка ${id} создана · статус «Подана»`);
      return id;
    },
    [initiatives, pushNotif, showToast],
  );

  const resubmitInitiative = useCallback(
    (id: string, payload: ResubmitPayload) => {
      setInitiatives((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                ...payload,
                status: "Подана",
                rejectReason: undefined,
                curator: i.curator || "—",
              }
            : i,
        ),
      );
      pushNotif(
        "blue",
        `${id} повторно отправлена на модерацию`,
        id,
      );
      showToast(`${id} снова в статусе «Подана»`);
    },
    [pushNotif, showToast],
  );

  const addComment = useCallback(
    (id: string, text: string) => {
      const author = `${CURRENT_USER} (${ROLES[role].label.toLowerCase()})`;
      setComments((prev) => ({
        ...prev,
        [id]: [...(prev[id] || []), { author, text, time: "только что" }],
      }));
      showToast("Комментарий добавлен");
    },
    [role, showToast],
  );

  const changeStatus = useCallback(
    (id: string, status: Status, reasonText?: string) => {
      setInitiatives((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                status,
                ...(reasonText
                  ? { rejectReason: reasonText }
                  : status !== "Отклонено" && status !== "На доработке"
                    ? { rejectReason: undefined }
                    : {}),
              }
            : i,
        ),
      );
      const needsReason = status === "Отклонено" || status === "На доработке";
      pushNotif(
        needsReason ? "amber" : "blue",
        `Инициатива ${id} переведена в статус «${status}»`,
        id,
      );
      showToast(`Статус → «${status}»`);
    },
    [pushNotif, showToast],
  );

  const moderate = useCallback(
    (id: string, act: "approve" | "rework" | "reject", reasonText?: string) => {
      if (act === "approve") {
        setInitiatives((prev) =>
          prev.map((i) =>
            i.id === id
              ? { ...i, status: "Скоринг", curator: CURRENT_USER }
              : i,
          ),
        );
        pushNotif(
          "green",
          `Инициатива ${id} принята куратором → «Скоринг»`,
          id,
        );
        showToast(`${id} → Скоринг`);
        return;
      }
      if (act === "rework") {
        setInitiatives((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: "На доработке",
                  rejectReason: reasonText,
                  curator: CURRENT_USER,
                }
              : i,
          ),
        );
        pushNotif("amber", `${id} возвращена на доработку`, id);
        showToast(`${id} на доработке`);
        return;
      }
      setInitiatives((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                status: "Отклонено",
                rejectReason: reasonText,
                curator: CURRENT_USER,
              }
            : i,
        ),
      );
      pushNotif("red", `${id} отклонена: ${reasonText}`, id);
      showToast(`${id} отклонена`);
    },
    [pushNotif, showToast],
  );

  const scoped = useMemo(
    () => deptInitiatives(initiatives),
    [initiatives],
  );

  const filtered = useMemo(
    () => filterInitiatives(scoped, filters),
    [scoped, filters],
  );

  const mine = useMemo(
    () => initiatives.filter((i) => i.author === CURRENT_USER),
    [initiatives],
  );

  const queue = useMemo(
    () =>
      initiatives.filter(
        (i) => i.status === "Подана" || i.status === "Модерация",
      ),
    [initiatives],
  );

  const value: DemoContextValue = {
    initiatives,
    comments,
    notifications,
    notifUnread,
    role,
    filters,
    activeCounter,
    drawerId,
    submitOpen,
    submitKey,
    reason,
    reasonKey,
    roleLabel: ROLES[role].label,
    allowedTabs: ROLES[role].tabs,
    canChangeStatus: CAN_CHANGE_STATUS.has(role),
    isAuthor: role === "author",
    scoped,
    filtered,
    mine,
    queue,
    dictTypes,
    dictImpacts,
    slaRows,
    toasts,
    setRole,
    setFilters,
    resetFilters,
    setActiveCounter,
    openDrawer: (id) => setDrawerId(id),
    closeDrawer: () => setDrawerId(null),
    openSubmit: () => {
      setSubmitKey((k) => k + 1);
      setSubmitOpen(true);
    },
    closeSubmit: () => setSubmitOpen(false),
    markNotifsRead: () => setNotifUnread(false),
    openNotif: (n) => {
      setNotifUnread(false);
      if (n.initiativeId) setDrawerId(n.initiativeId);
      else showToast("Демо: связанная заявка не найдена");
    },
    pushNotif,
    showToast,
    dismissToast,
    submitInitiative,
    resubmitInitiative,
    addComment,
    changeStatus,
    askReason: (title, onConfirm) => {
      setReasonKey((k) => k + 1);
      setReason({ title, onConfirm });
    },
    closeReason: () => setReason(null),
    moderate,
    addDictType: (value) => {
      const v = value.trim();
      if (!v) return;
      setDictTypes((prev) => (prev.includes(v) ? prev : [...prev, v]));
      showToast(`Тип «${v}» добавлен`);
    },
    removeDictType: (value) => {
      setDictTypes((prev) => prev.filter((t) => t !== value));
      showToast(`Тип «${value}» удалён`);
    },
    addDictImpact: (value) => {
      const v = value.trim();
      if (!v) return;
      setDictImpacts((prev) => (prev.includes(v) ? prev : [...prev, v]));
      showToast(`Влияние «${v}» добавлено`);
    },
    removeDictImpact: (value) => {
      setDictImpacts((prev) => prev.filter((t) => t !== value));
      showToast(`Влияние «${value}» удалено`);
    },
    updateSlaDays: (stage, days) => {
      setSlaRows((prev) =>
        prev.map((r) => (r.stage === stage ? { ...r, days } : r)),
      );
      showToast(`SLA «${stage}»: ${days} дн. (демо)`);
    },
  };

  return (
    <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
