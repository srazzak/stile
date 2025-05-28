import { todoStore } from "@/lib/storage";
import { type Todo } from "./storage/types";

export async function exportTodosToJson() {
  try {
    const todos: Todo[] = await todoStore.getAllTodos();
    const jsonString = JSON.stringify(todos, null, 2); // null, 2 for pretty printing

    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "todos.json"; // Desired filename

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up
  } catch (error) {
    console.error("Failed to export todos:", error);
  }
}
