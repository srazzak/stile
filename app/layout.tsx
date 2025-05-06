import { Outlet, useNavigate } from "react-router";
import { useShortcut } from "./hooks/useShortcut";
import { useKeyboard } from "./contexts/keyboard-context";

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
      <div className="h-full w-full">
        <div className="flex flex-col gap-2">
          <span className="text-sm mt-16 text-gray-400">
            active context: {activeContext}
          </span>
          <div className="inline-flex gap-2">
            {keyBuffer.current.map((k) => (
              <span key={k} className="text-sm bg-gray-300 px-1 py-0.5">
                {k}
              </span>
            ))}
          </div>
          <div className="inline-flex gap-2">
            {activeShortcuts.map((sh) => (
              <span
                key={sh.description}
                className="text-sm bg-gray-300 px-1 py-0.5"
              >
                {sh.key}
              </span>
            ))}
          </div>
        </div>
        <Outlet />
      </div>
    </main>
  );
}
