import {
  Tooltip,
  TooltipPositioner,
  TooltipPopup,
} from "@/components/ui/tooltip";
import type { FC, PropsWithChildren } from "react";
import { Kbd } from "./kbd";

interface ShortcutTooltipProps extends PropsWithChildren {
  content: string;
  shortcut: string[];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
}

const ShortcutTooltip: FC<ShortcutTooltipProps> = ({
  content,
  shortcut,
  children,
  side = "top",
  align = "center",
  sideOffset = 8,
  alignOffset = 0,
}) => {
  const shortcutText =
    shortcut.length > 1 ? (
      <>
        <Kbd>{shortcut[0]}</Kbd> then <Kbd>{shortcut[1]}</Kbd>
      </>
    ) : (
      <Kbd>{shortcut}</Kbd>
    );

  return (
    <Tooltip delay={200}>
      {children}
      <TooltipPositioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
      >
        <TooltipPopup className="inline-flex gap-2">
          {content}
          <span>{shortcutText}</span>
        </TooltipPopup>
      </TooltipPositioner>
    </Tooltip>
  );
};

export { ShortcutTooltip };
