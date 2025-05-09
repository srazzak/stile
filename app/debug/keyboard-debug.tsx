import { useKeyboard } from "@/contexts/keyboard-context";

export function KeyboardDebug() {
  const { activeContext, debugKeyBuffer, getActiveShortcuts } = useKeyboard();

  if (import.meta.env.DEV) {
    return (
      <div className="fixed ml-auto w-72 inset-x-4 inset-y-4 flex flex-col p-3 text-xs gap-1 h-fit bg-gray-100 rounded-xl">
        <div className="font-bold text-gray-500">keyboard debug</div>
        <div className="flex">active context: {activeContext}</div>
        <div className="inline-flex gap-1 items-center flex-wrap">
          active shortcuts:
          <ul className="inline-flex gap-2 flex-wrap">
            {getActiveShortcuts().map((k) => (
              <div className="bg-background-800 px-1 rounded py-0.5">
                {k.key.map((v) => (
                  <span>{v}</span>
                ))}
              </div>
            ))}
          </ul>
        </div>
        <div className="inline-flex gap-1">
          key buffer: {JSON.stringify(debugKeyBuffer)}
        </div>
      </div>
    );
  }
}
