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
  offset: number;
  addTransaction: (transaction: DbTransaction) => void;
  increaseOffset: () => void;
  decreaseOffset: () => void;
}

/**
 * Zustand store for managing database transactions history for undo/redo functionality.
 * Stores a list of transactions and tracks the current state index.
 */
export const useTransactionStore = create<DbTransactionStore>()((set, get) => ({
  transactions: [],
  offset: -1,
  addTransaction: (tx: DbTransaction) => {
    const { transactions, offset: currentTransaction } = get();

    // TODO: add max size for tx store
    const newTransactions = transactions.slice(0, currentTransaction + 1);
    newTransactions.push(tx);

    set({
      transactions: newTransactions,
      offset: newTransactions.length - 1,
    });
  },
  increaseOffset: () =>
    set((state) => ({
      offset: Math.max(-1, state.offset - 1),
    })),
  decreaseOffset: () =>
    set((state) => ({
      offset: Math.max(-1, state.offset + 1),
    })),
}));

export const transactionStore = useTransactionStore;
