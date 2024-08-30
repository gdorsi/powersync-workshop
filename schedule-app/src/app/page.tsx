import {
  PersonRecord,
  Tables,
  TaskRecord,
} from "@/library/powersync/AppSchema";
import { useQuery } from "@powersync/react";
import React from "react";
import { Schedule } from "./Schedule";

export function MainPage() {
  const { data: people } = useQuery<PersonRecord>(
    `SELECT ${Tables.People}.* FROM ${Tables.People}`
  );

  const { data: tasks } = useQuery<TaskRecord>(
    `SELECT ${Tables.Tasks}.* FROM ${Tables.Tasks}`
  );

  return (
    <>
      {" "}
      <pre>
        {JSON.stringify(people, null, 2)}
        {JSON.stringify(tasks, null, 2)}
      </pre>
      <Schedule />
    </>
  );
}
