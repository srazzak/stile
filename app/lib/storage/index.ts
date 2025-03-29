import { TodoDb } from "./TodoDatabase";

declare global {
  export interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  }
}

export const todoStore = new TodoDb();

// Initialize both services
todoStore.initialize();
