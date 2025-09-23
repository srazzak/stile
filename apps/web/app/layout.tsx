import { Outlet, useNavigate } from "react-router";
import { useShortcut } from "@/hooks/useShortcut";
import { Navbar } from "@/components/navbar";
import { KeyboardDebug } from "@/debug/keyboard-debug";
import { TransactionDebug } from "@/debug/transaction-debug";
import { todoStore } from "./lib/storage";
import { NotesPanel } from "./components/notes-panel";
import { useStore } from "./stores/store";

export default function Layout() {
  const navigate = useNavigate();
  const toggleNotesPanel = useStore((state) => state.toggleNotesPanel);

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

  useShortcut({
    key: ["u"],
    handler: () => todoStore.undo(),
    description: "Undo last action",
    contexts: ["global"],
  });

  useShortcut({
    key: ["i"],
    handler: () => todoStore.redo(),
    description: "Redo last action",
    contexts: ["global"],
  });

  useShortcut({
    key: ["o"],
    handler: toggleNotesPanel,
    description: "Open Notes panel",
    contexts: ["global"],
  });

  return (
    <main className="flex flex-col p-4 pt-32 grow">
      <div className="fixed mr-auto top-0 left-0 flex flex-col gap-4 p-4">
        <KeyboardDebug />
        <TransactionDebug />
      </div>
      <Navbar />
      <Outlet />
      <NotesPanel />
    </main>
  );
}
