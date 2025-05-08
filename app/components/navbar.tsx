import { todoStore } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { Link, useLocation } from "react-router";
import {
  Tooltip,
  TooltipTrigger,
  TooltipPopup,
  TooltipPositioner,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";

export function Navbar() {
  const todoCount = useLiveQuery(() => todoStore.getTodoCount(), []);

  const location = useLocation();

  return (
    <div className="inline-flex gap-2 mb-8 text-xs py-1 px-2 rounded-lg outline outline-foreground/10 w-fit shadow-sm">
      <TooltipProvider delay={200}>
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                to="/"
                className={cn(
                  "font-mono inline-flex w-fit items-center duration-150",
                  location.pathname === "/"
                    ? ""
                    : "text-neutral-400 hover:text-neutral-500",
                )}
              >
                TODAY
                <span className="ml-1 px-1 rounded bg-background-900">
                  {todoCount?.pending}
                </span>
              </Link>
            }
          />
          <TooltipPositioner sideOffset={8}>
            <TooltipPopup className="inline-flex gap-2">
              Go to Today
              <span>
                <Kbd>G</Kbd> then <Kbd>T</Kbd>
              </span>
            </TooltipPopup>
          </TooltipPositioner>
        </Tooltip>
        <div className="w-px h-auto bg-background-900 my-0.5"></div>
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                to="/later"
                className={cn(
                  "font-mono inline-flex w-fit items-center duration-150",
                  location.pathname === "/later"
                    ? ""
                    : "text-neutral-400 hover:text-neutral-500",
                )}
              >
                LATER
                <span className={cn("ml-1 px-1 rounded bg-background-900")}>
                  {todoCount?.later}
                </span>
              </Link>
            }
          />
          <TooltipPositioner sideOffset={8}>
            <TooltipPopup className="inline-flex gap-2">
              Go to Later
              <span>
                <Kbd>G</Kbd> then <Kbd>L</Kbd>
              </span>
            </TooltipPopup>
          </TooltipPositioner>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
