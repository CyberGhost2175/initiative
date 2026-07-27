export type Status =
  | "Подана"
  | "Модерация"
  | "Скоринг"
  | "Бэклог"
  | "В работе"
  | "Product Hub"
  | "Пилот"
  | "Стандарт"
  | "Внедрение"
  | "Отклонено"
  | "На доработке";

export type RoleId =
  | "author"
  | "curator"
  | "owner"
  | "commission"
  | "lead"
  | "admin";

export type ViewId =
  | "showcase"
  | "mine"
  | "queue"
  | "analytics"
  | "admin";

export type Initiative = {
  id: string;
  title: string;
  type: string;
  impact: string;
  author: string;
  dept: string;
  project: string;
  status: Status;
  effect: string;
  effort: string;
  date: string;
  problem: string;
  proposal: string;
  curator: string;
  rejectReason?: string;
  attachments?: string[];
};

export type Comment = {
  author: string;
  text: string;
  time: string;
};

export type NotificationItem = {
  type: "blue" | "red" | "green" | "amber";
  text: string;
  time: string;
  initiativeId?: string;
};

export type Filters = {
  search: string;
  status: string;
  statusGroup: string;
  type: string;
  impact: string;
  effect: string;
  effort: string;
};

export type SubmitPayload = {
  title: string;
  problem: string;
  proposal: string;
  type: string;
  impact: string;
  effect: string;
  effort: string;
  attachments?: string[];
};

export type ResubmitPayload = {
  title: string;
  problem: string;
  proposal: string;
  type: string;
  impact: string;
  effect: string;
  effort: string;
};

export type SlaRow = {
  stage: string;
  days: number;
  escalate: string;
};

export type ToastItem = {
  id: number;
  text: string;
};
