import { PersonRecord, TaskRecord } from "@/lib/powersync/AppSchema";

import { useVirtualizer, Virtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

export function Schedule(props: {
  people: PersonRecord[];
  tasks: TaskRecord[];
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: props.people.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  return (
    <div className="overflow-auto w-full h-[500px]" ref={parentRef}>
      <div
        className="w-full relative"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <PersonRow
              person={props.people[virtualRow.index]}
              virtualizer={columnVirtualizer}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonRow(props: {
  person: PersonRecord;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
}) {
  return props.person.name;
}
