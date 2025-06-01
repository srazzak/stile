export type Todo = CompleteTodo | IncompleteTodo;

export interface CompleteTodo {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  completed: true;
  completedAt: Date;
  deadline?: Date;
  sectionId: string;
}

export interface IncompleteTodo {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  completed: false;
  completedAt?: undefined;
  deadline?: Date;
  sectionId: string;
}

export interface Section {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
