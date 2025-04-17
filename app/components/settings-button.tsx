import {
  CalendarIcon,
  QueueListIcon,
  Cog6ToothIcon,
} from "@heroicons/react/16/solid";
import { useView } from "@/contexts/view-context";
import { Menu as BaseMenu } from "@base-ui-components/react";
import {
  Menu,
  MenuTrigger,
  MenuPopup,
  MenuPositioner,
  MenuGroupLabel,
  MenuGroup,
} from "@/components/ui/menu";
import { useShortcut } from "@/hooks/useShortcut";
import { useState } from "react";

export function SettingsButton() {
  const [open, setOpen] = useState(false);
  const { setView } = useView();

  useShortcut({
    key: "e l",
    handler: (e) => setView("list"),
    description: "Set view to list",
  });

  useShortcut({
    key: "e t",
    handler: (e) => setView("timeline"),
    description: "Set view to timeline",
  });

  return (
    <Menu open={open} onOpenChange={setOpen}>
      <MenuTrigger className="inline-flex w-8 h-8 rounded hover:bg-[#EFD7BF] duration-100 justify-center items-center">
        <Cog6ToothIcon className="h-4 w-4" />
      </MenuTrigger>
      <MenuPositioner>
        <MenuPopup className="h-32">
          <ViewSettings />
        </MenuPopup>
      </MenuPositioner>
    </Menu>
  );
}

function ViewSettings() {
  const { view, setView } = useView();

  return (
    <MenuGroup className="flex flex-col gap-2">
      <MenuGroupLabel>View</MenuGroupLabel>
      <BaseMenu.RadioGroup value={view} onValueChange={setView}>
        <div className="flex gap-2 w-full">
          <BaseMenu.RadioItem
            value="list"
            className="flex flex-col justify-center items-center text-sm gap-1 w-full border border-stone-300 py-2 rounded data-[highlighted]:bg-background-900 data-[checked]:bg-background-900 duration-75"
          >
            <QueueListIcon className="h-4 w-4" />
            List
          </BaseMenu.RadioItem>
          <BaseMenu.RadioItem
            value="timeline"
            className="flex flex-col justify-center items-center text-sm gap-1 w-full border border-stone-300 py-2 rounded data-[highlighted]:bg-background-900 data-[checked]:bg-background-900 duration-75"
          >
            <CalendarIcon className="h-4 w-4" />
            Timeline
          </BaseMenu.RadioItem>
        </div>
      </BaseMenu.RadioGroup>
    </MenuGroup>
  );
}
