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
    <nav className="flex flex-row justify-between items-center mb-12">
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
      <HowToDialog />
    </nav>
  );
}

function HowToDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            className="p-2 hover:bg-background-900 duration-75 rounded-lg"
            aria-label="How To Dialog"
          >
            <BookOpenIcon className="h-4 w-4" />
          </button>
        }
      ></DialogTrigger>
      <DialogPopup>
        <div className="flex flex-col p-3">
          <div className="font-serif text-stone-400 text-xl font-bold">
            How to use
          </div>
          <div className="text-stone-500 text-sm *:mt-3 *:mb-3">
            <p>
              Verdigris aims to be the calmest todo app you've used. It's
              offline-only so that the work doesn't follow you and it's (really)
              fast.
            </p>
            <p>
              There are only two pages you need to know: Today and Later. Today
              where are all the tasks you want to get done today are. Later is
              where all the tasks that can wait and get done later are. That's
              it.
            </p>
            <div className="w-full h-px bg-stone-300"></div>
            <div className="font-serif text-stone-400 text-xl font-bold">
              Shortcuts
            </div>
            <span className="font-medium text-stone-400 italic">
              When on a todo list page
            </span>
            <ul className="*:my-2">
              <li>
                <Kbd>G</Kbd> then <Kbd>T</Kbd> - Go to Today page
              </li>
              <li>
                <Kbd>G</Kbd> then <Kbd>L</Kbd> - Go to Later page
              </li>
              <li>
                <Kbd>J</Kbd> - Navigate down the todo list
              </li>
              <li>
                <Kbd>K</Kbd> - Navigate up the todo list
              </li>
            </ul>
            <span className="font-medium text-stone-400 italic">
              When a todo is highlighted
            </span>
            <ul className="*:my-2">
              <li>
                <Kbd>T</Kbd> - Toggle todo complete/incomplete
              </li>
              <li>
                <Kbd>E</Kbd> - Edit todo
              </li>
              <li>
                <Kbd>D</Kbd> - Delete todo
              </li>
              <li>
                <Kbd>M</Kbd> then <Kbd>T</Kbd> - Move todo to Today page
              </li>
              <li>
                <Kbd>M</Kbd> then <Kbd>L</Kbd> - Move todo to Later page
              </li>
            </ul>
          </div>
        </div>
      </DialogPopup>
    </Dialog>
  );
}
