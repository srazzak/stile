import { TodoDialog } from "@/components/todo/todo-dialog";
import { TodoList } from "@/components/todo/todo-list";
import { useView } from "@/contexts/view-context";
import { todoStore } from "@/lib/storage";
import { useLiveQuery } from "dexie-react-hooks";
import { TodoTimeline } from "../components/todo/todo-timeline";
import { EmptyTodo } from "@/components/todo/empty-todo";

export function Main() {
  const { view } = useView();

  const todos = useLiveQuery(
    () =>
      view === "list" ? todoStore.getPendingTodos() : todoStore.getAllTodos(),
    [view],
    [],
  );

  return (
    <div className="w-full h-full">
      {view === "list" ? (
        <>
          <TodoList todos={todos} />
          <EmptyTodo />
        </>
      ) : (
        <TodoTimeline todos={todos} />
      )}
      <TodoDialog />
    </div>
  );
}
