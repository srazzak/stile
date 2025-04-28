// route("later")
import type { Route } from "./+types/later";
import { TodoList } from "@/components/todo/todo-list";
import { useLiveQuery } from "dexie-react-hooks";
import { todoStore } from "@/lib/storage";
import { EmptyTodo } from "@/components/todo/empty-todo";
import { TodoTimeline } from "@/components/todo/todo-timeline";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Verdigris | Later" },
    { name: "description", content: "A simple todo app" },
  ];
}

export default function LaterPage() {
  const todos = useLiveQuery(
    () => todoStore.getPendingTodos("later"),
    [],
    [],
  );

  return (
    <div className="h-full w-full">
      {todos ? (
        <>
          <TodoList todos={todos} />
          <EmptyTodo />
        </>
      ) : (
        <TodoTimeline todos={todos} />
      )}
    </div>
  );
}
