// route("later")
import type { Route } from "./+types/later";
import { TodoList } from "@/components/todo/todo-list";
import { useLiveQuery } from "dexie-react-hooks";
import { todoStore } from "@/lib/storage";
import { EmptyTodo } from "@/components/todo/empty-todo";
import { TodoDialog } from "@/components/todo/todo-dialog";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Verdigris | Later" },
    { name: "description", content: "A simple todo app" },
  ];
}

export default function LaterPage() {
  const todos = useLiveQuery(() => todoStore.getPendingTodos("later"), [], []);

  return (
    <div className="w-full h-full">
      <header className="flex flex-col gap-2 mb-12">
        <h1 className="font-serif text-2xl text-black">Later</h1>
      </header>
      <div>
        <TodoList todos={todos} sectionId="later" />
        <EmptyTodo sectionId="later" />
      </div>
      <TodoDialog sectionId="later" />
    </div>
  );
}
