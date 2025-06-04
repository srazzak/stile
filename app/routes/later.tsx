// route("/later")
import type { Route } from "./+types/later";
import { TodoList } from "@/components/todo/todo-list";
import { useLiveQuery } from "dexie-react-hooks";
import { todoStore } from "@/lib/storage";
import { EmptyTodo } from "@/components/todo/empty-todo";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Verdigris | Later" },
    { name: "description", content: "A simple todo app" },
  ];
}

export default function LaterPage() {
  const todos = useLiveQuery(() => todoStore.getPendingTodos("later"), []);

  if (todos) {
    return (
      <div className="w-full h-full">
        <header className="flex flex-col gap-2 mb-8">
          <h1 className="font-serif text-2xl text-black">Later</h1>
          <span className="font-serif text-neutral-500">
            Things to get done later.
          </span>
        </header>
        <div>
          <TodoList todos={todos} />
          <EmptyTodo sectionId="later" />
        </div>
      </div>
    );
  }
}
