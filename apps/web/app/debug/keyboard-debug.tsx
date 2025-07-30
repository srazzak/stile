import { Kbd } from "@/components/ui/kbd";
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
              <div className="bg-gray-200 p-1 rounded inline-flex gap-1">
                {k.key.map((v) => (
                  <Kbd>{v}</Kbd>
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
