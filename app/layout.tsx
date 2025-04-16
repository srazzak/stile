import { Outlet } from "react-router";
import { SectionDialog } from "./components/section/section-dialog";
import { SettingsButton } from "./components/settings-button";

export default function Layout() {
  return (
    <main className="mx-auto flex h-full w-full max-w-4xl flex-col p-4 pt-32 xl:max-w-3xl">
      <div className="w-full flex justify-end">
        <SettingsButton />
      </div>
      <h1 className="animate-slide-in mb-16 text-center font-serif text-4xl text-black">
        What needs to get done?
      </h1>
      <div className="h-full w-full">
        <Outlet />
        <SectionDialog />
      </div>
    </main>
  );
}
