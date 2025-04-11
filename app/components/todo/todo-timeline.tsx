import { EmptyTodo } from "@/components/todo/empty-todo";
import { TodoList } from "@/components/todo/todo-list";
import type { Todo } from "@/lib/storage/types";

export interface TodoTimlineProps {
  todos: Todo[];
}

export function TodoTimeline({ todos }: TodoTimlineProps) {
  const grouped = todos.reduce<Record<string, Todo[]>>((acc, todo) => {
    const originalDate = todo.completed
      ? todo.completedAt
      : new Date().toLocaleDateString("en-US");
    const date = new Date(originalDate);
    date.setHours(0, 0, 0, 0);
    const dateString = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    if (!acc[dateString]) {
      acc[dateString] = [];
    }

    acc[dateString].push(todo);

    return acc;
  }, {});

  const sortedDateArray = Object.entries(grouped).sort(([dateA], [dateB]) => {
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return (
    <section className="w-full h-full flex flex-col gap-4">
      {sortedDateArray.map(([date, todos], index) => (
        <div key={date}>
          <h3 className="font-medium text-md text-zinc-500 mb-3 font-serif">
            {date}
          </h3>
          <TodoList todos={todos} />
          {index === 0 ? <EmptyTodo /> : null}
        </div>
      ))}
      {sortedDateArray.length === 0 ? <EmptyTodo /> : null}
    </section>
  );
}
