import { useState } from "react";
import { Input } from "../ui/input";
import { todoStore } from "@/lib/storage";

export const EmptySection = () => {
  const [sectionName, setSectionName] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sectionName.trim()) {
      todoStore.createSection({
        title: sectionName,
      });
      setSectionName("");
    }
  };

  return (
    <form
      className="flex flex-col gap-2 opacity-0 duration-100 group-hover:opacity-100 focus-within:opacity-100"
      onSubmit={handleSubmit}
    >
      <Input
        placeholder="add section"
        className="w-full font-serif text-xl"
        value={sectionName}
        onChange={(e) => setSectionName(e.target.value)}
      />
    </form>
  );
};
