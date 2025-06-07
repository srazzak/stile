import { Outlet, useNavigate } from "react-router";
import { useShortcut } from "@/hooks/useShortcut";
import { Navbar } from "@/components/navbar";
import { KeyboardDebug } from "@/debug/keyboard-debug";
import { TransactionDebug } from "@/debug/transaction-debug";
import { todoStore } from "./lib/storage";

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

  return (
    <main className="flex flex-col p-4 pt-32 grow">
      <KeyboardDebug />
      <Navbar />
      <Outlet />
      <TransactionDebug />
    </main>
  );
}
