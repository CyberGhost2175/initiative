import { RoleGate } from "@/components/RoleGate";
import { MineView } from "@/components/MineView";

export default function MinePage() {
  return (
    <RoleGate view="mine">
      <MineView />
    </RoleGate>
  );
}
