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
  updateActiveTodo: (id: string | null) => void;
  transactions: DbTransaction[];
  transactionIndex: number;
  addTransaction: (transaction: DbTransaction) => void;
  updateTransactionIndex: (by: number) => void;
}

/**
 * Zustand store for managing app state.
 */
export const useStore = create<AppState>()((set, get) => ({
  activeTodo: null,
  updateActiveTodo: (id) => set(() => ({ activeTodo: id })),
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
  updateTransactionIndex: (by: number) =>
    set((state) => ({
      transactionIndex: Math.max(-1, state.transactionIndex + by),
    })),
}));
