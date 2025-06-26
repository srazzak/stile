import { Cog6ToothIcon, ArrowDownTrayIcon } from "@heroicons/react/16/solid";
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
import { exportTodosToJson } from "@/lib/io";
import { TooltipTrigger } from "./ui/tooltip";
import { ShortcutTooltip } from "./ui/shortcut-tooltip";

export function SettingsButton() {
  const [open, setOpen] = useState(false);

  useShortcut({
    key: ["s"],
    handler: () => setOpen(true),
    description: "Open settings",
  });

  return (
    <Menu open={open} onOpenChange={setOpen}>
      <ShortcutTooltip content="View settings" shortcut={["S"]}>
        <TooltipTrigger
          render={
            <MenuTrigger
              render={
                <IconButton>
                  <Cog6ToothIcon className="h-4 w-4" />
                </IconButton>
              }
            />
          }
        />
      </ShortcutTooltip>
      <MenuPositioner align="end">
        <MenuPopup>
          <MenuItem onClick={exportTodosToJson}>
            <ArrowDownTrayIcon className="h-4 w-4" />
            Export todos
          </MenuItem>
        </MenuPopup>
      </MenuPositioner>
    </Menu>
  );
}
