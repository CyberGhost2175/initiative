import { RoleGate } from "@/components/RoleGate";
import { QueueView } from "@/components/QueueView";

export default function QueuePage() {
  return (
    <RoleGate view="queue">
      <QueueView />
    </RoleGate>
  );
}
