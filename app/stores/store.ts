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

interface AppState {
  activeTodo: string | null;
  transactions: DbTransaction[];
  transactionIndex: number;
  addTransaction: (transaction: DbTransaction) => void;
  increaseTransactionIndex: () => void;
  decreaseTransactionIndex: () => void;
}

/**
 * Zustand store for managing app state.
 */
export const useStore = create<AppState>()((set, get) => ({
  activeTodo: null,
  transactions: [],
  transactionIndex: -1,
  addTransaction: (tx: DbTransaction) => {
    const { transactions, transactionIndex: index } = get();

    const newTransactions = transactions.slice(
      Math.max(0, transactions.length - 32),
      index + 1,
    );
    newTransactions.push(tx);

    set({
      transactions: newTransactions,
      transactionIndex: newTransactions.length - 1,
    });
  },
  increaseTransactionIndex: () =>
    set((state) => ({
      transactionIndex: Math.max(-1, state.transactionIndex + 1),
    })),
  decreaseTransactionIndex: () =>
    set((state) => ({
      transactionIndex: Math.max(-1, state.transactionIndex - 1),
    })),
}));
