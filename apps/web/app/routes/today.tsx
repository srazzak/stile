// route("/")
import type { Route } from "./+types/today";
import { TodoList } from "@/components/todo/todo-list";
import { todoStore } from "@/lib/storage";
import { useLiveQuery } from "dexie-react-hooks";
import { EmptyTodo } from "@/components/todo/empty-todo";
import { format } from "date-fns";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Stile" },
    { name: "description", content: "A simple todo app" },
  ];
}

export default function Today() {
  const todos = useLiveQuery(() => todoStore.getPendingTodos("today"));

  if (todos) {
    return (
      <div className="w-full h-full">
        <header className="flex flex-col gap-2 mb-8">
          <h1 className="font-serif text-2xl text-black">Today</h1>
          <span className="font-serif text-neutral-500 ml-[3px]">
            {format(new Date(), "eeee, MMMM d")}
          </span>
        </header>
        <div>
          <TodoList todos={todos} />
          <EmptyTodo sectionId="today" />
        </div>
      </div>
    );
  }
}
