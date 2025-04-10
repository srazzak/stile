import { Dialog, DialogPopup } from "@/components/ui/dialog";
import { useState } from "react";
import { useShortcut } from "@/hooks/useShortcut";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import { todoStore } from "@/lib/storage";
import { type Section, type Todo } from "@/lib/storage/types";
import { Separator } from "@/components/ui/separator";
import { TodoInput } from "./todo-input";

interface TodoDialogProps {
  section?: Section;
}

export function TodoDialog({ section }: TodoDialogProps) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);

  useShortcut({
    key: "c",
    description: "Create a new todo",
    handler: () => setOpen(true),
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title.trim()) {
      const newTodo: Omit<Todo, "createdAt" | "id"> = {
        title: title.trim(),
        description: "",
        completed: false,
        updatedAt: new Date(),
        deadline: deadline,
        sectionId: section?.id,
      };

      await todoStore.createTodo(newTodo);
      setTitle("");
      setDeadline(undefined);
      setOpen(false);
    }
  }

  function handleDismount() {
    setTitle("");
    setDeadline(undefined);
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
            {section && (
              <div className="w-fit rounded-sm border border-gray-200 px-2 py-0.5 font-serif shadow-lg font-medium">
                {section.title}
              </div>
            )}
            <TodoInput
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              aria-required
              completed={false}
            />
          </div>
          <Separator />
          <div className="flex justify-between p-2">
            <div className="flex items-center">
              <DatePicker
                selectedDate={deadline}
                setSelectedDate={setDeadline}
              />
            </div>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
