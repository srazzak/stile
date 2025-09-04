export type Todo = CompleteTodo | IncompleteTodo;

export interface BaseTodo {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
  sectionId: string;
}

export interface CompleteTodo extends BaseTodo {
  completed: true;
  completedAt: Date;
}

export interface IncompleteTodo extends BaseTodo {
  completed: false;
  completedAt?: undefined;
}

export interface Section {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
