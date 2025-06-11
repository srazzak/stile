import { todoStore } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { Link, useLocation } from "react-router";
import { TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { Dialog, DialogPopup, DialogTrigger } from "./ui/dialog";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  BookOpenIcon,
} from "@heroicons/react/16/solid";
import { IconButton } from "./ui/icon-button/icon-button";
import { ShortcutTooltip } from "./ui/shortcut-tooltip";
import { useEffect, useState } from "react";
import { useShortcut } from "@/hooks/useShortcut";
import { useKeyboard } from "@/contexts/keyboard-context";
import { SettingsButton } from "./settings-button";
import { Tabs, TabsTab, TabsList, TabsPanel } from "@/components/ui/tabs";
import { useTransactionStore } from "@/stores/transactions";

export function Navbar() {
  const todoCount = useLiveQuery(() => todoStore.getIncompletedTodoCount(), []);

  const location = useLocation();

  return (
    <nav className="flex flex-row justify-between items-center mb-12">
      <div className="inline-flex gap-2 text-xs p-1 rounded-lg outline outline-foreground/10 w-fit shadow-sm">
        <TooltipProvider delay={200}>
          <ShortcutTooltip content="Go to Today" shortcut={["G", "T"]}>
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
                    {todoCount?.today}
                  </span>
                </Link>
              }
            />
          </ShortcutTooltip>
          <div className="w-px h-auto bg-background-900 my-0.5"></div>
          <ShortcutTooltip content="Go to Later" shortcut={["G", "L"]}>
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
          </ShortcutTooltip>
        </TooltipProvider>
      </div>
      <div className="inline-flex gap-1">
        <TooltipProvider delay={200}>
          <UndoButton />
          <RedoButton />
          <HowToDialog />
          <SettingsButton />
        </TooltipProvider>
      </div>
    </nav>
  );
}

function UndoButton() {
  const index = useTransactionStore((state) => state.index);

  return (
    <ShortcutTooltip content="Undo" shortcut={["U"]}>
      <TooltipTrigger
        render={
          <IconButton onClick={() => todoStore.undo()} disabled={index < 0}>
            <ArrowUturnLeftIcon className={cn("h-4 w-4")} />
          </IconButton>
        }
      />
    </ShortcutTooltip>
  );
}

function RedoButton() {
  const index = useTransactionStore((state) => state.index);
  const transactions = useTransactionStore((state) => state.transactions);

  return (
    <ShortcutTooltip content="Redo" shortcut={["U"]}>
      <TooltipTrigger
        render={
          <IconButton
            onClick={() => todoStore.redo()}
            disabled={index === transactions.length - 1}
          >
            <ArrowUturnRightIcon className="h-4 w-4" />
          </IconButton>
        }
      />
    </ShortcutTooltip>
  );
}

function HowToDialog() {
  const [open, setOpen] = useState(false);

  const { setActiveContext } = useKeyboard();

  useShortcut({
    key: ["h"],
    description: "Open How To modal",
    handler: () => setOpen(true),
    contexts: ["global"],
  });

  useEffect(() => {
    if (open) {
      setActiveContext("modal");
    } else {
      setActiveContext("global");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <ShortcutTooltip content="How to" shortcut={["H"]}>
        <TooltipTrigger
          render={
            <DialogTrigger
              render={
                <IconButton
                  className="p-2 hover:bg-background-900 duration-75 rounded-lg"
                  variant="default"
                  aria-label="How To Dialog"
                >
                  <BookOpenIcon className="h-4 w-4 text-foreground/85" />
                </IconButton>
              }
            />
          }
        />
      </ShortcutTooltip>
      <DialogPopup>
        <Tabs defaultValue="how-to" className="px-4 py-8">
          <TabsList>
            <TabsTab value="how-to">How to</TabsTab>
            <TabsTab value="shortcuts">Shortcuts</TabsTab>
          </TabsList>
          <TabsPanel value="how-to" className="flex flex-col">
            <div className="text-stone-500 text-sm *:my-3">
              <p>
                There are two pages you need to know: <b>Today</b> and{" "}
                <b>Later</b>.
              </p>
              <p>
                <b>Today</b> where are all the tasks you want to get done today
                are.
              </p>
              <p>
                <b>Later</b> is where all the tasks that can wait and get done
                later are.
              </p>
              <p>
                Complete tasks today or move them to later. Move tasks from
                later to today when you're ready to do them.
              </p>
            </div>
          </TabsPanel>
          <TabsPanel value="shortcuts" className="flex flex-col">
            <div className="text-stone-500 text-sm *:my-3">
              <div className="font-medium text-stone-400 italic">
                When on todo list view
              </div>
              <ul className="*:my-2">
                <li>
                  <Kbd>G</Kbd> then <Kbd>T</Kbd> - Go to Today page
                </li>
                <li>
                  <Kbd>G</Kbd> then <Kbd>L</Kbd> - Go to Later page
                </li>
                <li>
                  <Kbd>J</Kbd> or <Kbd>ArrowDown</Kbd> - Navigate down the todo
                  list
                </li>
                <li>
                  <Kbd>K</Kbd> or <Kbd>ArrowUp</Kbd> - Navigate up the todo list
                </li>
                <li>
                  <Kbd>C</Kbd> - Create new todo
                </li>
                <li>
                  <Kbd>U</Kbd> - Undo
                </li>
                <li>
                  <Kbd>I</Kbd> - Redo
                </li>
                <li>
                  <Kbd>H</Kbd> - View How To modal
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
                  <Kbd>M</Kbd> - Move todo to other list
                </li>
              </ul>
            </div>
          </TabsPanel>
        </Tabs>
      </DialogPopup>
    </Dialog>
  );
}
