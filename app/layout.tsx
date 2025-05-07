import { Outlet, useNavigate } from "react-router";
import { useShortcut } from "./hooks/useShortcut";
import { useKeyboard } from "./contexts/keyboard-context";
import { Navbar } from "./components/navbar";

export default function Layout() {
  const navigate = useNavigate();

  const { activeContext, getActiveShortcuts, keyBuffer } = useKeyboard();

  const activeShortcuts = getActiveShortcuts();

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
      <Navbar />
      <Outlet />
    </main>
  );
}
