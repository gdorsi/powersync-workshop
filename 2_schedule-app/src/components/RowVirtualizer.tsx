import { cellIndexToDate } from "@/lib/dates";
import { Virtualizer } from "@tanstack/react-virtual";
import { ReactNode } from "react";

export function RowVirtualizer(props: {
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  children: (date: string) => ReactNode;
}) {
  return (
    <>
      {props.virtualizer.getVirtualItems().map((virtualCell) => (
        <div
          key={virtualCell.index}
          className="h-full absolute top-0 left-0 bg-slate-50 border-solid border-2 border-slate-100"
          style={{
            width: `${virtualCell.size}px`,
            transform: `translateX(${virtualCell.start}px)`,
          }}
        >
          {props.children(cellIndexToDate(virtualCell.index))}
        </div>
      ))}
    </>
  );
}
