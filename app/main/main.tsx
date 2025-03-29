import { TodoDialog } from "@/components/todo/todo-dialog";
import { SectionDialog } from "@/components/section/section-dialog";
import { TodoList } from "@/components/todo/todo-list";
import { todoStore } from "@/lib/storage";
import { useLiveQuery } from "dexie-react-hooks";

export function Main() {
  const todos = useLiveQuery(() => todoStore.getAllTodos(), [], []);

  return (
    <div className="w-full h-full">
      <TodoList todos={todos} />
      <TodoDialog />
      <SectionDialog />
    </div>
  );
}
