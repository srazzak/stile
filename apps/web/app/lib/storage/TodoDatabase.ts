import Dexie, { type Table } from "dexie";
import {
  type Todo,
  type Section,
  type IncompleteTodo,
  type Note,
} from "./types";
import { generateId } from "../utils";
import { upgradeToV3, upgradeToV4, upgradeToV5 } from "./upgrades";
import { useStore, type TodoUpdateDiff } from "@/stores/store";

class TodoDatabase extends Dexie {
  todos!: Table<Todo>;
  sections!: Table<Section>;
  notes!: Table<Note>;

  constructor() {
    super("todo_db");

    this.version(1).stores({
      todos: "id, completed, createdAt, deadline, updatedAt",
    });

    this.version(2)
      .stores({
        todos:
          "id, completed, deadline, createdAt, updatedAt, completedAt, sectionId",
        sections: "id, title, createdAt, updatedAt",
      })
      .upgrade(upgradeToV3);

    // need a second one since dexie upgrade only runs once.
    this.version(3)
      .stores({
        todos:
          "id, completed, deadline, createdAt, updatedAt, completedAt, sectionId",
        sections: "id, title, createdAt, updatedAt",
      })
      .upgrade(upgradeToV3);

    this.version(4)
      .stores({
        todos:
          "id, completed, deadline, createdAt, updatedAt, completedAt, sectionId",
      })
      .upgrade(upgradeToV4);

    this.version(5)
      .stores({
        todos:
          "id, completed, deadline, createdAt, updatedAt, completedAt, sectionId",
      })
      .upgrade(upgradeToV5);

    this.version(5)
      .stores({
        todos:
          "id, completed, deadline, createdAt, updatedAt, completedAt, sectionId",
        notes: "id",
      })
      .upgrade(upgradeToV5);
  }
}

export class TodoDb {
  public db: TodoDatabase;

  constructor() {
    this.db = new TodoDatabase();
  }

  async initialize(): Promise<void> {
    try {
      await this.db.open();
    } catch (error) {
      console.error("Failed to open database:", error);
    }
  }

  async getNote(id: string): Promise<Note | undefined> {
    if ((await this.db.notes.count()) === 0) {
      const now = new Date();
      const newNote = {
        id: "main",
        content: "",
        createdAt: now,
        updatedAt: now,
      };

      this.db.notes.add(newNote);

      return newNote;
    }

    return this.db.notes.get(id);
  }

  async updateNote(id: string, newContent: string): Promise<void> {
    const updatedAt = new Date();
    const note = await this.getNote(id);

    await this.db.notes.update(id, {
      ...note,
      updatedAt: updatedAt,
      content: newContent,
    });
  }

  async createTodo(
    todo: Omit<
      Todo,
      "id" | "createdAt" | "updatedAt" | "completed" | "completedAt"
    >,
  ) {
    const todoId = generateId();
    const today = new Date();

    const incompleteTodo: IncompleteTodo = {
      ...todo,
      id: todoId,
      createdAt: today,
      updatedAt: today,
      completed: false,
      completedAt: undefined,
    };

    await this.db.todos.add(incompleteTodo);

    useStore
      .getState()
      .addTransaction({ todo: incompleteTodo, event: "create" });
  }

  async updateTodo(id: string, update: Partial<Todo>): Promise<void> {
    const updatedAt = new Date();
    const todo = await this.getTodo(id);

    await this.db.todos.update(id, {
      ...update,
      updatedAt: updatedAt,
    });

    const updateKeys = Object.keys(update) as (keyof Todo)[];

    const diffs = updateKeys.map((k: keyof Todo) => ({
      field: k,
      previousValue: todo![k as keyof Todo],
      newValue: update[k as keyof Todo],
    })) as TodoUpdateDiff[];

    useStore
      .getState()
      .addTransaction({ todoId: id, event: "update", diffs: diffs });
  }

  async deleteTodos() {
    this.db.todos.clear();
  }

  async deleteTodo(id: string): Promise<void> {
    const todo = await this.getTodo(id);
    await this.db.todos.delete(id);

    useStore.getState().addTransaction({ todo: todo!, event: "delete" });
  }

  async undo(): Promise<void> {
    const index = useStore.getState().transactionIndex;

    // return if at beginning of tx buffer (i.e. no more tx to undo)
    if (index < 0) {
      return;
    }

    const transactions = useStore.getState().transactions;

    const currentTx = transactions[index];

    if (currentTx.event === "create") {
      await this.db.todos.delete(currentTx.todo.id);
    } else if (currentTx.event === "delete") {
      await this.db.todos.add(currentTx.todo);
    } else {
      const updates: Partial<Todo> = Object.fromEntries([
        ...currentTx.diffs.map((diff) => [diff?.field, diff?.previousValue]),
      ]);

      console.log(updates);

      await this.db.todos.update(currentTx.todoId, updates);
    }

    useStore.getState().updateTransactionIndex(-1);
  }

  async redo(): Promise<void> {
    const txIndex = useStore.getState().transactionIndex;

    const transactions = useStore.getState().transactions;

    // return if already at end of tx buffer (i.e. no more tx to redo)
    if (txIndex === transactions.length - 1) {
      return;
    }

    // grab the next transaction and execute
    const currentTx = transactions[txIndex + 1];

    if (currentTx.event === "create") {
      await this.db.todos.add(currentTx.todo);
    } else if (currentTx.event === "delete") {
      await this.db.todos.delete(currentTx.todo.id);
    } else {
      const updates: Partial<Todo> = Object.fromEntries([
        ...currentTx.diffs.map((diff) => [diff?.field, diff?.newValue]),
      ]);

      await this.db.todos.update(currentTx.todoId, updates);
    }

    useStore.getState().updateTransactionIndex(1);
  }

  async getTodo(id: string): Promise<Todo | undefined> {
    return this.db.todos.get(id);
  }

  async getAllTodos(): Promise<Todo[]> {
    return this.db.todos.toArray();
  }

  async getTodos(sectionId: string) {
    return this.db.todos.where("sectionId").equals(sectionId).toArray();
  }

  async getPendingTodos(sectionId: string): Promise<Todo[]> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return this.db.todos
      .where("sectionId")
      .equals(sectionId)
      .filter(
        (todo) =>
          !todo.completed ||
          (todo.completed &&
            todo.completedAt >= startOfToday &&
            todo.completedAt <= endOfToday),
      )
      .sortBy("createdAt");
  }

  async getIncompletedTodoCount(): Promise<{ today: number; later: number }> {
    const todayTodosCount = await this.db.todos
      .where("sectionId")
      .equals("today")
      .and((todo) => !todo.completed)
      .count();
    const laterTodosCount = await this.db.todos
      .where("sectionId")
      .equals("later")
      .and((todo) => !todo.completed)
      .count();

    return {
      today: todayTodosCount,
      later: laterTodosCount,
    };
  }

  async getTodosBySectionId(sectionId: string): Promise<Todo[]> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return this.db.todos
      .where("sectionId")
      .equals(sectionId)
      .and(
        (todo) =>
          !todo.completed ||
          (todo.completed &&
            todo.completedAt >= startOfToday &&
            todo.completedAt <= endOfToday),
      )
      .sortBy("createdAt");
  }
}
