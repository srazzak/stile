import { TodoDialog } from "@/components/todo/todo-dialog";
import { TodoList } from "@/components/todo/todo-list";
import { todoStore } from "@/lib/storage";
import { useLiveQuery } from "dexie-react-hooks";
import { EmptyTodo } from "@/components/todo/empty-todo";
import { format } from "date-fns";

export function Today() {
  const todos = useLiveQuery(() => todoStore.getPendingTodos(), [], []);

  return (
    <div className="w-full h-full">
      <header className="flex flex-col gap-2 mb-12">
        <h1 className="font-serif text-2xl text-black">Today</h1>
        <span className="font-serif text-neutral-500 ml-[3px]">
          {format(new Date(), "eeee, MMMM d")}
        </span>
      </header>
      <div>
        <TodoList todos={todos} />
        <EmptyTodo />
      </div>
      <TodoDialog />
    </div>
  );
}
