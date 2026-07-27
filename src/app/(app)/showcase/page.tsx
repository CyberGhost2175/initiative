import { RoleGate } from "@/components/RoleGate";
import { ShowcaseView } from "@/components/ShowcaseView";

export default function ShowcasePage() {
  return (
    <RoleGate view="showcase">
      <ShowcaseView />
    </RoleGate>
  );
}
