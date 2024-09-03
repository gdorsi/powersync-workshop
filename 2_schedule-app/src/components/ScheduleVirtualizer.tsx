import { PersonRecord, Tables, TaskRecord } from "@/1_AppSchema";

import { useVirtualizer, Virtualizer } from "@tanstack/react-virtual";
import { memo, ReactNode, useEffect, useMemo, useRef } from "react";
import { AddTask } from "../6_AddTask";
import { cellIndexToDate, dateToString, getColumnCount } from "@/lib/dates";
import { useQuery } from "@powersync/react";
import { usePeople } from "@/3_usePeople";

const ROW_HEIGHT = 50;
const CELL_WIDTH = 100;

function useVirtualizers(peopleCount: number) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: peopleCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 0,
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
