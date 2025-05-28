import {
  CalendarIcon,
  QueueListIcon,
  Cog6ToothIcon,
} from "@heroicons/react/16/solid";
import { useView, type ViewType } from "@/contexts/view-context";
import { Switch } from "@/components/ui/switch";
import { useTodoFilters } from "@/contexts/todo-filters-context";
import { useShortcut } from "@/hooks/useShortcut";
import { useState } from "react";
import {
  Menu,
  MenuPopup,
  MenuPositioner,
  MenuTrigger,
  MenuItem,
} from "./ui/menu";
import { IconButton } from "./ui/icon-button/icon-button";
import { exportTodosToJson } from "@/lib/export";

export function SettingsButton() {
  const [open, setOpen] = useState(false);

  useShortcut({
    key: ["m"],
    handler: () => setOpen(true),
    description: "Open menu",
  });

  return (
    <Menu open={open} onOpenChange={setOpen}>
      <MenuTrigger
        render={
          <IconButton>
            <Cog6ToothIcon className="h-4 w-4" />
          </IconButton>
        }
      />
      <MenuPositioner>
        <MenuPopup>
          <MenuItem onClick={exportTodosToJson}>Export todos</MenuItem>
        </MenuPopup>
      </MenuPositioner>
    </Menu>
  );
}

function ViewSettings() {
  const { view, setView } = useView();

  function handleViewChange(newView: ViewType) {
    if (view !== newView) {
      setView(newView);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-gray-500">View</label>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 w-full">
          <button
            value="list"
            className="flex flex-col justify-center items-center text-xs gap-1 w-full border border-stone-300 py-1 rounded data-[checked=true]:bg-background-900 duration-75"
            onClick={() => handleViewChange("list")}
            data-checked={view === "list"}
          >
            <QueueListIcon className="h-4 w-4" />
            List
          </button>
          <button
            value="timeline"
            className="flex flex-col justify-center items-center text-xs gap-1 w-full border border-stone-300 py-1 rounded data-[checked=true]:bg-background-900 duration-75"
            onClick={() => handleViewChange("timeline")}
            data-checked={view === "timeline"}
          >
            <CalendarIcon className="h-4 w-4" />
            Timeline
          </button>
        </div>
      </div>
    </div>
  );
}

function OptionsSettings() {
  const { hideCompleted, setHideCompleted } = useTodoFilters();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-gray-500">Options</label>
      <div className="flex justify-between items-center">
        <span className="text-sm">Hide completed todos</span>
        <Switch checked={hideCompleted} onCheckedChange={setHideCompleted} />
      </div>
    </div>
  );
}
