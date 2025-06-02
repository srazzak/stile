import type { Todo } from "@/lib/storage/types";
import { create } from "zustand";

export type DbTransaction =
  | CreateTransaction
  | DeleteTransaction
  | UpdateTransaction;

export interface CreateTransaction {
  event: "create";
  todo: Todo;
}

export interface DeleteTransaction {
  event: "delete";
  todo: Todo;
}

export interface UpdateTransaction {
  event: "update";
  todoId: string;
  diffs: TodoUpdateDiff[];
}

interface FieldUpdateDiff<T, K extends keyof T> {
  field: K;
  previousValue: T[K];
  newValue: T[K];
}

export type TodoUpdateDiff = {
  [K in keyof Todo]: FieldUpdateDiff<Todo, K>;
}[keyof Todo];

interface DbTransactionStore {
  transactions: DbTransaction[];
  index: number;
  addTransaction: (transaction: DbTransaction) => void;
  increaseIndex: () => void;
  decreaseIndex: () => void;
}

/**
 * Zustand store for managing database transactions history for undo/redo functionality.
 * Stores a list of transactions and tracks the current state index.
 */
export const useTransactionStore = create<DbTransactionStore>()((set, get) => ({
  transactions: [],
  index: -1,
  addTransaction: (tx: DbTransaction) => {
    const { transactions, index } = get();

    const newTransactions = transactions.slice(
      Math.max(0, transactions.length - 32),
      index + 1,
    );
    newTransactions.push(tx);

    set({
      transactions: newTransactions,
      index: newTransactions.length - 1,
    });
  },
  increaseIndex: () =>
    set((state) => ({
      index: Math.max(-1, state.index + 1),
    })),
  decreaseIndex: () =>
    set((state) => ({
      index: Math.max(-1, state.index - 1),
    })),
}));

export const transactionStore = useTransactionStore;
