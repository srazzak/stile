import { todoStore } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { EmptySection } from "./empty-section";
import { type Section } from "@/lib/storage/types";
import { Link, useLocation } from "react-router";

function SectionLink({
  section,
  isActive,
}: {
  section: Section;
  isActive: boolean;
}) {
  const count = useLiveQuery(async () => {
    const todos = await todoStore.getTodosBySectionId(section.id);
    return todos.filter((todo) => !todo.completed).length;
  }, [section]);

  return (
    <Link
      to={{ pathname: `/section/${section.id}` }}
      className={cn(
        "flex items-baseline gap-1 font-serif text-gray-400",
        "hover:text-gray-500",
        isActive ? "text-foreground hover:text-foreground underline" : "",
      )}
    >
      {section.title}
      <span className="-translate-y-[1px] text-sm">
        {count && count > 0 ? ` (${count})` : ""}
      </span>
    </Link>
  );
}

export function SectionList() {
  let location = useLocation();
  const sections = useLiveQuery(() => todoStore.getAllSections());

  return (
    <ul className="group absolute left-0 flex w-fit flex-col gap-2 px-6 py-60 text-xl font-medium">
      <Link
        to={{ pathname: "/" }}
        className={cn(
          "font-serif text-gray-400",
          "hover:text-gray-500",
          location.pathname === "/"
            ? "text-foreground hover:text-foreground underline"
            : "",
        )}
      >
        home
      </Link>
      {sections?.map((section) => (
        <SectionLink
          key={section.id}
          section={section}
          isActive={location.pathname === `/section/${section.id}`}
        />
      ))}
      <EmptySection />
    </ul>
  );
}
