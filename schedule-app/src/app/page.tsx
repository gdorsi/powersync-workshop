import { PersonRecord, Tables } from "@/lib/powersync/AppSchema";
import { useQuery } from "@powersync/react";
import React from "react";
import { Schedule } from "../components/Schedule";

import { AddPerson } from "../components/AddPerson";

export function MainPage() {
  const { data: people } = useQuery<PersonRecord>(
    `SELECT ${Tables.People}.* FROM ${Tables.People} ORDER BY ${Tables.People}.created_at DESC`
  );

  // console.log(people)

  // const { data: tasks } = useQuery<TaskRecord>(
  //   `SELECT ${Tables.Tasks}.* FROM ${Tables.Tasks}`
  // );

  // console.log(tasks);

  return (
    <>
      <AddPerson />
      <Schedule people={people} />
    </>
  );
}
