import { Outlet, useNavigate } from "react-router";
import { useShortcut } from "./hooks/useShortcut";
import { Navbar } from "./components/navbar";
import { KeyboardDebug } from "./debug/keyboard-debug";

export default function Layout() {
  const navigate = useNavigate();

  useShortcut({
    key: ["g", "t"],
    handler: () => navigate("/"),
    description: "Go to Today",
    contexts: ["global"],
  });

  useShortcut({
    key: ["g", "l"],
    handler: () => navigate("/later"),
    description: "Go to Later",
    contexts: ["global"],
  });

  return (
    <main className="mx-auto flex h-full w-full max-w-4xl flex-col p-4 pt-32 xl:max-w-3xl">
      <KeyboardDebug />
      <Navbar />
      <Outlet />
    </main>
  );
}
