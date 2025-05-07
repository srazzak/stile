import { todoStore } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { Link, useLocation } from "react-router";

export function Navbar() {
  const todoCount = useLiveQuery(() => todoStore.getTodoCount(), []);

  const location = useLocation();

  return (
    <div className="inline-flex gap-2 mb-8 text-xs py-1 px-2 rounded-lg border border-background-900 w-fit shadow-xs">
      <Link
        to="/"
        className={cn(
          "font-mono inline-flex w-fit items-center",
          location.pathname === "/" ? "" : "text-neutral-400",
        )}
      >
        TODAY
        <span className="ml-1 px-1 rounded bg-background-900">
          {todoCount?.pending}
        </span>
      </Link>
      <div className="w-px h-auto bg-background-900 my-0.5"></div>
      <Link
        to="/later"
        className={cn(
          "font-mono inline-flex w-fit items-center",
          location.pathname === "/later" ? "" : "text-neutral-400",
        )}
      >
        LATER
        <span className={cn("ml-1 px-1 rounded bg-background-900")}>
          {todoCount?.later}
        </span>
      </Link>
    </div>
  );
}
