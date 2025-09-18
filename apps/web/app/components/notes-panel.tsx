import { useDebounce } from "@/hooks/useDebounce";
import { todoStore } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useRef, useState } from "react";

export function NotesPanel() {
  const showNotesPanel = useStore((state) => state.showNotesPanel);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const note = useLiveQuery(() => todoStore.getNote("main"), []);

  const [internalContent, setInternalContent] = useState(note?.content);
  const debouncedContent = useDebounce(internalContent, 500);

  useEffect(() => {
    notesRef.current?.focus();
    const len = notesRef.current?.value.length;
    notesRef.current?.setSelectionRange(len ?? 0, len ?? 0);

    return () => notesRef.current?.blur();
  }, [showNotesPanel]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  }

  useEffect(() => {
    if (note && debouncedContent && debouncedContent !== note.content) {
      todoStore.updateNote(note.id, debouncedContent);
    }
  }, [debouncedContent]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    setInternalContent(e.currentTarget.value);
  }

  if (!showNotesPanel) return;

  if (!note) return;

  return (
    <div
      className={cn(
        "fixed top-0 right-0 w-96 h-full border-l border-l-neutral-300 p-4 flex flex-col gap-4",
      )}
    >
      <h2 className="font-serif text-xl text-neutral-800">Notes</h2>
      <textarea
        className="w-full h-full focus:outline-none focus-visible:outline-none"
        name="notes"
        id="notes"
        ref={notesRef}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        defaultValue={note.content}
      />
    </div>
  );
}
