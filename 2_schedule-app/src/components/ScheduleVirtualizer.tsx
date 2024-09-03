import { PersonRecord } from "@/1_AppSchema";

import { useVirtualizer, Virtualizer } from "@tanstack/react-virtual";
import { ReactNode, useEffect, useRef } from "react";
import { cellIndexToReadableDate, getColumnCount } from "@/lib/dates";

const ROW_HEIGHT = 100;
const CELL_WIDTH = 200;

function useVirtualizers(peopleCount: number) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: peopleCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 0,
    paddingStart: 50,
  });

  const columnCount = getColumnCount();

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columnCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => CELL_WIDTH,
    overscan: 0,
  });

  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    columnVirtualizer.scrollToIndex(columnCount / 2);
  }, []);

  return {
    scrollRef,
    rowVirtualizer,
    columnVirtualizer,
  };
}

export function ScheduleVirtualizer(props: {
  people: PersonRecord[];
  children: (props: {
    person: PersonRecord;
    cellVirtualizer: Virtualizer<HTMLDivElement, Element>;
  }) => ReactNode;
}) {
  const { columnVirtualizer, rowVirtualizer, scrollRef } = useVirtualizers(
    props.people.length
  );

  return (
    <div className="overflow-auto w-full h-[100vh]" ref={scrollRef}>
      <div
        className="relative"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: `${columnVirtualizer.getTotalSize()}px`,
        }}
      >
        <div className="sticky top-0 h-[50px] w-full z-10">
          {columnVirtualizer.getVirtualItems().map((virtualCell) => (
            <div
              key={virtualCell.index}
              className="h-full flex items-center justify-center text-center absolute top-0 left-0 bg-white border-solid border-b-2 border-black"
              style={{
                width: `${virtualCell.size}px`,
                transform: `translateX(${virtualCell.start}px)`,
              }}
            >
              {cellIndexToReadableDate(virtualCell.index)}
            </div>
          ))}
        </div>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            className="w-full absolute top-0 left-0"
            style={{
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {props.children({
              person: props.people[virtualRow.index],
              cellVirtualizer: columnVirtualizer,
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
