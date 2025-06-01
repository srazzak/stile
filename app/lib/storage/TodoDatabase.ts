import Dexie, { type Table } from "dexie";
import { type Todo, type Section } from "./types";
import { generateId } from "../utils";
import { upgradeToV3, upgradeToV4, upgradeToV5 } from "./upgrades";

class TodoDatabase extends Dexie {
  todos!: Table<Todo>;
  sections!: Table<Section>;

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

  async createTodo(
    todo: Omit<Todo, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    const id = await this.db.todos.add({
      ...todo,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: false,
      completedAt: undefined,
    });
    return id;
  }

  async updateTodo(
    id: string,
    updates: Partial<Omit<Todo, "createdAt">>,
  ): Promise<void> {
    await this.db.todos.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  async getTodo(id: string): Promise<Todo | undefined> {
    return this.db.todos.get(id);
  }

  async deleteTodo(id: string): Promise<void> {
    await this.db.todos.delete(id);
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
