import { Dialog, DialogPopup } from "@/components/ui/dialog";
import { useState } from "react";
import { useShortcut } from "@/hooks/useShortcut";
import { Button } from "../ui/button";
import { todoStore } from "@/lib/storage";
import { type Section } from "@/lib/storage/types";
import { Separator } from "@/components/ui/separator";
import { TodoInput } from "./todo-input";

export function SectionDialog() {
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);

  useShortcut({
    key: "s",
    description: "Create a new section",
    handler: () => setOpen(true),
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title.trim()) {
      const newSection: Omit<Section, "createdAt" | "updatedAt" | "id"> = {
        title: title.trim(),
      };

      await todoStore.createSection(newSection);
      setTitle("");
      setOpen(false);
    }
  }

  function handleDismount() {
    setTitle("");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={handleDismount}
    >
      <DialogPopup className="text-foreground space-y-4">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 p-2">
            <TodoInput
              placeholder="Section title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              aria-required
              completed={false}
            />
          </div>
          <Separator />
          <div className="flex justify-end p-2">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
