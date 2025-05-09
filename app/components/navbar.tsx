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
import { Dialog, DialogPopup, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { BookOpenIcon } from "@heroicons/react/16/solid";

export function Navbar() {
  const todoCount = useLiveQuery(() => todoStore.getTodoCount(), []);

  const location = useLocation();

  return (
    <div className="flex flex-row justify-between items-center mb-12">
      <div className="inline-flex gap-2 text-xs p-1 rounded-lg outline outline-foreground/10 w-fit shadow-sm">
        <TooltipProvider delay={200}>
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  to="/"
                  className={cn(
                    "font-mono inline-flex w-fit items-center duration-150 rounded-l pl-1",
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
                    "font-mono inline-flex w-fit items-center duration-150 rounded-r pr-px",
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
    </div>
  );
}

function PromiseDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            <BookOpenIcon className="h-4 w-4" />
          </Button>
        }
      ></DialogTrigger>
      <DialogPopup>
        <h1>The promise</h1>
        <div>lorem ipsum</div>
      </DialogPopup>
    </Dialog>
  );
}
