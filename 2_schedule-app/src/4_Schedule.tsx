import { PersonRecord, Tables, TaskRecord } from "@/1_AppSchema";

import { memo } from "react";
import { AllocationForm } from "./6_AllocationForm";
import { useQuery } from "@powersync/react";
import { usePeople } from "@/3_usePeople";
import { ScheduleVirtualizer } from "./components/ScheduleVirtualizer";
import { RowVirtualizer } from "./components/RowVirtualizer";
import { PersonNameCell } from "./components/PersonNameCell";
import { AddPersonForm } from "./5_AddPersonForm";

export function Schedule() {
  const people = usePeople();

  return (
    <>
      {/* Virtualize the Schedule rendering */}
      <ScheduleVirtualizer people={people}>
        {({ person, cellVirtualizer }) => (
          <>
            <PersonNameCell person={person} />
            <RowVirtualizer virtualizer={cellVirtualizer}>
              {(date) => <ScheduleCell person={person} date={date} />}
            </RowVirtualizer>
          </>
        )}
      </ScheduleVirtualizer>
      <AddPersonForm /> {/* The dialog to add people */}
    </>
  );
}

const ScheduleCell = memo((props: { date: string; person: PersonRecord }) => {
  // Since the cells are virtualized, only the visible tasks are extracted from the local db
  const { data: tasks } = useQuery<TaskRecord>(
    `SELECT ${Tables.Tasks}.* FROM ${Tables.Tasks} WHERE ${Tables.Tasks}.date = ? AND ${Tables.Tasks}.person_id = ?`,
    [props.date, props.person.id]
  );

  // If there are no tasks in this cell, render the button to add one!
  if (!tasks.length) {
    return (
      <AllocationForm person={props.person} date={props.date}>
        <button className="h-full w-full"></button>
      </AllocationForm>
    );
  }

  // Otherwise render the task name
  return (
    <div className="flex h-full w-full justify-center items-center bg-white overflow-hidden text-sm text-center">
      {tasks.map((t) => t.name).join(", ")}
    </div>
  );
});
