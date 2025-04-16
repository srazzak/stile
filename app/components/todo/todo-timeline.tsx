import { EmptyTodo } from "@/components/todo/empty-todo";
import { TodoList } from "@/components/todo/todo-list";
import type { Todo } from "@/lib/storage/types";
import { subDays } from "date-fns";

export interface TodoTimlineProps {
  todos: Todo[];
}

export function TodoTimeline({ todos }: TodoTimlineProps) {
  const grouped = groupTodos(todos);

  const sortedDateArray = Object.entries(grouped).sort(([dateA], [dateB]) => {
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return (
    <section className="w-full h-full flex flex-col gap-4">
      {sortedDateArray.map(([date, todos], index) => todos.length > 0 && (
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

type TimelineGroup =
  | "Today"
  | "Yesterday"
  | "Previous 7 days"
  | "Previous 30 days";

function groupTodos(todos: Todo[]) {
  const grouped: Record<TimelineGroup, Todo[]> = {
    Today: [],
    Yesterday: [],
    "Previous 7 days": [],
    "Previous 30 days": [],
  };

  todos.forEach((todo) => {
    if (todo.completed) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (todo.completedAt > subDays(today, 1)) {
        grouped["Yesterday"].push(todo);
      } else if (todo.completedAt > subDays(today, 7)) {
        grouped["Previous 7 days"].push(todo);
      } else if (todo.completedAt > subDays(today, 30)) {
        grouped["Previous 30 days"].push(todo);
      }
    } else {
      grouped["Today"].push(todo);
    }
  });

  return grouped;
}
