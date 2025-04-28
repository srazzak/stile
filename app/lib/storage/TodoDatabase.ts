import Dexie, { type Table } from "dexie";
import { type Todo, type Section } from "./types";
import { generateId } from "../utils";
import { upgradeToV3 } from "./v3-upgrade";
import { upgradeToV4 } from "./v4-upgrade";

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

  async getAllTodos(sectionId?: string): Promise<Todo[]> {
    return this.db.todos
      .filter((todo) =>
        sectionId ? todo.sectionId === sectionId : todo.sectionId === undefined,
      )
      .toArray();
  }

  async getPendingTodos(sectionId?: string): Promise<Todo[]> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return this.db.todos
      .filter(
        (todo) =>
          ((sectionId
            ? todo.sectionId === sectionId
            : todo.sectionId === undefined) &&
            !todo.completed) ||
          (todo.completed &&
            todo.completedAt >= startOfToday &&
            todo.completedAt <= endOfToday),
      )
      .sortBy("completedAt");
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
      .reverse()
      .sortBy("completedAt");
  }

  async getAllSections(): Promise<Section[]> {
    return this.db.sections.toArray();
  }

  async getSection(id: string): Promise<Section | undefined> {
    return this.db.sections.get(id);
  }

  async createSection(
    section: Omit<Section, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    const now = new Date();

    const id = await this.db.sections.add({
      ...section,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    });
    return id;
  }

  async updateSection(
    id: string,
    updates: Partial<Omit<Section, "createdAt">>,
  ): Promise<void> {
    await this.db.sections.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  async deleteSection(id: string): Promise<void> {
    try {
      await this.db.transaction("rw", this.db.sections, this.db.todos, () => {
        this.db.sections.where("id").equals(id).delete();
        this.db.todos.where("sectionId").equals(id).delete();
      });
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  }
}
