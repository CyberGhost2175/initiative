import { RoleGate } from "@/components/RoleGate";
import { AnalyticsView } from "@/components/AnalyticsView";

export default function AnalyticsPage() {
  return (
    <RoleGate view="analytics">
      <AnalyticsView />
    </RoleGate>
  );
}
