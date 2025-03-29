// route("section/:sectionId")
import type { Route } from "./+types/section";
import { useRef } from "react";
import { TodoList } from "@/components/todo/todo-list";
import { useLiveQuery } from "dexie-react-hooks";
import { todoStore } from "@/lib/storage";
import { TodoDialog } from "@/components/todo/todo-dialog";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Verdigris" },
    { name: "description", content: "A simple todo app" },
  ];
}

export default function SectionPage({ params }: Route.ComponentProps) {
  const sectionId = params.sectionId;

  const section = useLiveQuery(
    () => todoStore.getSection(sectionId),
    [sectionId],
  );

  const todos = useLiveQuery(
    () => todoStore.getTodosBySectionId(sectionId),
    [sectionId],
  );

  const sectionTitleRef = useRef<HTMLInputElement>(null);

  function handleSectionTitleChange(formData: FormData) {
    if (!section) return;

    const sectionTitle = formData.get("sectionTitle") as string;

    if (sectionTitle === section?.title) return;
    todoStore.updateSection(section?.id, { title: sectionTitle });
    sectionTitleRef.current?.blur();
  }

  return (
    <div className="h-full w-full">
      <form action={handleSectionTitleChange}>
        <input
          ref={sectionTitleRef}
          name="sectionTitle"
          className="mb-4 font-serif text-xl font-medium"
          defaultValue={section?.title}
        />
      </form>
      {todos && section && <TodoList todos={todos} sectionId={section.id} />}
      {section && <TodoDialog section={section} />}
    </div>
  );
}
