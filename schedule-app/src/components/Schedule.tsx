import { PersonRecord, Tables, TaskRecord } from "@/lib/powersync/AppSchema";

import { useVirtualizer, Virtualizer } from "@tanstack/react-virtual";
import { memo, useEffect, useMemo, useRef } from "react";
import { AddTask } from "./AddTask";
import { cellIndexToDate, dateToString, getColumnCount } from "@/lib/dates";
import { useQuery } from "@powersync/react";

const ROW_HEIGHT = 50;
const CELL_WIDTH = 100;

export function Schedule(props: { people: PersonRecord[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: props.people.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 0,
  });

  const columnCount = getColumnCount();

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columnCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CELL_WIDTH,
    overscan: 0,
  });

  useEffect(() => {
    const el = parentRef.current;

    if (!el) return;

    columnVirtualizer.scrollToIndex(columnCount / 2);
  }, []);

  return (
    <div className="overflow-auto w-full h-[100vh]" ref={parentRef}>
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
  return (
    <>
      <div className="sticky h-full w-[100px] left-0 top-0 inline-block z-10 bg-white border-solid border-2 border-black">
        <div className="flex h-full justify-center items-center">
          {props.person.name}
        </div>
      </div>
      {props.virtualizer.getVirtualItems().map((virtualCell) => (
        <div
          key={virtualCell.index}
          className="h-full absolute top-0 left-0 bg-slate-50 border-solid border-2 border-slate-100"
          style={{
            width: `${virtualCell.size}px`,
            transform: `translateX(${virtualCell.start}px)`,
          }}
        >
          <TaskCell
            person={props.person}
            date={cellIndexToDate(virtualCell.index)}
          />
        </div>
      ))}
    </>
  );
}

const TaskCell = memo((props: { date: string; person: PersonRecord }) => {
  const { data: tasks } = useQuery<TaskRecord>(
    `SELECT ${Tables.Tasks}.* FROM ${Tables.Tasks} WHERE ${Tables.Tasks}.start_date = ? AND ${Tables.Tasks}.person_id = ?`,
    [props.date, props.person.id]
  );

  if (!tasks.length) {
    return (
      <AddTask person={props.person} date={props.date}>
        <button className="h-full w-full"></button>
      </AddTask>
    );
  }

  return (
    <div className="flex h-full w-full justify-center items-center bg-white overflow-hidden text-sm">
      {tasks.map((t) => t.name).join(", ")}
    </div>
  );
});
