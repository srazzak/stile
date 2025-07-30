import type { Transaction } from "dexie";
import type { CompleteTodo, Todo } from "./types";

export function upgradeToV3(transaction: Transaction) {
  return transaction
    .table("todos")
    .toCollection()
    .modify((todo: Partial<CompleteTodo>) =>
      todo.completed && !todo.completedAt
        ? (todo.completedAt = todo.updatedAt)
        : null,
    );
}

export function upgradeToV4(transaction: Transaction) {
  return transaction
    .table("todos")
    .toCollection()
    .modify((todo: Todo) =>
      todo.sectionId ? (todo.sectionId = "later") : null,
    );
}

export function upgradeToV5(transaction: Transaction) {
  return transaction
    .table("todos")
    .toCollection()
    .modify((todo: Todo) =>
      !todo.sectionId ? (todo.sectionId = "today") : null,
    );
}
