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

export async function importTodosFromJson(overwrite: boolean) {
  const input = document.createElement("input");
  input.type = "file";

  input.addEventListener("change", async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e: ProgressEvent<FileReader>) => {
        try {
          const jsonString = e.target?.result as string;
          const todos: Todo[] = JSON.parse(jsonString);

          if (overwrite) {
            await todoStore.deleteTodos()
          }
          
          for (const todo of todos) {
            await todoStore.createTodo(todo);
          }
          
          // Optionally, provide feedback to the user (e.g., show a success message)
          console.log("Todos imported successfully!");
        } catch (error) {
          console.error("Failed to parse or import todos:", error);
          // Optionally, provide error feedback to the user
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsText(file);
    }
  });

  input.click(); // Trigger the file selection dialog
}
