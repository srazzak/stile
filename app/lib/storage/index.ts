import { TodoDb } from "./TodoDatabase";

export const todoStore = new TodoDb();

if (typeof window !== "undefined") {
  todoStore.initialize();
}
