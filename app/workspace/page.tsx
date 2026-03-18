import OfficeScene from "../_components/3d/OfficeScene";
import LogoutButton from "../_components/ui/LogoutButton";

export default function WorkspacePage() {
  return (
    <main className="w-full h-screen bg-black relative">
      <LogoutButton />
      <OfficeScene />
    </main>
  );
}
