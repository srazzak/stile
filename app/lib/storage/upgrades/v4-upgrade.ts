import type { Transaction } from "dexie";
import type { Todo } from "../types";

export function upgradeToV4(transaction: Transaction) {
  return transaction
    .table("todos")
    .toCollection()
    .modify((todo: Todo) =>
      todo.sectionId ? (todo.sectionId = "later") : null,
    );
}
