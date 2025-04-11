import type { Transaction } from "dexie";
import type { Todo } from "./types";

export function upgradeToV2(transaction: Transaction) {
  return transaction
    .table("todos")
    .toCollection()
    .modify((todo: Todo) =>
      todo.completed && !todo.completedAt
        ? (todo.completedAt = todo.updatedAt)
        : null,
    );
}
