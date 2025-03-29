export interface Todo {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
  completedAt?: Date;
  deadline?: Date;
  sectionId?: string;
}

export interface Section {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
