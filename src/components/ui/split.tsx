
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
  ImperativePanelHandle,
} from "react-resizable-panels";

// Define the direction type since it's not exported from react-resizable-panels
type Direction = "horizontal" | "vertical";

interface SplitProps extends React.ComponentPropsWithoutRef<typeof PanelGroup> {
  direction: Direction; // Make direction required
}

const Split = React.forwardRef<
  React.ElementRef<typeof PanelGroup>,
  SplitProps
>(({ className, direction, ...props }, ref) => (
  <PanelGroup
    ref={ref}
    className={cn(
      direction === "horizontal" ? "flex-row" : "flex-col",
      "flex h-full w-full overflow-hidden",
      className
    )}
    direction={direction}
    {...props}
  />
));
Split.displayName = "Split";

interface SplitPaneProps extends React.ComponentPropsWithoutRef<typeof Panel> {
  className?: string;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  collapsible?: boolean;
  collapsedSize?: number;
}

const SplitPane = React.forwardRef<
  React.ElementRef<typeof Panel>,
  SplitPaneProps
>(
  (
    {
      className,
      defaultSize,
      minSize = 10,
      maxSize = 90,
      collapsible,
      collapsedSize,
      ...props
    },
    ref
  ) => (
    <Panel
      ref={ref}
      className={cn("overflow-auto", className)}
      defaultSize={defaultSize}
      minSize={minSize}
      maxSize={maxSize}
      collapsible={collapsible}
      collapsedSize={collapsedSize}
      {...props}
    />
  )
);
SplitPane.displayName = "SplitPane";

const SplitResizeHandle = ({ className, ...props }) => (
  <PanelResizeHandle
    className={cn(
      "relative flex w-1.5 items-center justify-center bg-slate-200 after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-1.5 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  />
);
SplitResizeHandle.displayName = "SplitResizeHandle";

export { Split, SplitPane, SplitResizeHandle };
