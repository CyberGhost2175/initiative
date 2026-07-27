import { RoleGate } from "@/components/RoleGate";
import { AdminView } from "@/components/AdminView";

export default function AdminPage() {
  return (
    <RoleGate view="admin">
      <AdminView />
    </RoleGate>
  );
}
