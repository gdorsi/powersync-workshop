import { column, Schema, TableV2 } from "@powersync/web";

export enum Tables {
  People = "people",
  Tasks = "tasks",
  Timeoffs = "timeoffs",
}

// This is how you declare a table with Powersync
// Mind that since we are using SQLite the datatypes are quite limited here
const tasks = new TableV2(
  {
    owner_id: column.text,
    created_at: column.text,
    name: column.text,
    date: column.text,
    person_id: column.text,
  },
  // Since we have a real DB we can use indexes to optimize our queries
  { indexes: { list: ["person_id", "date"] } }
);

const timeoffs = new TableV2(
  {
    owner_id: column.text,
    created_at: column.text,
    name: column.text,
    date: column.text,
    person_id: column.text,
  },
  // Since we have a real DB we can use indexes to optimize our queries
  { indexes: { list: ["person_id", "date"] } }
);

const people = new TableV2({
  created_at: column.text,
  name: column.text,
  owner_id: column.text,
});

export const AppSchema = new Schema({
  people,
  tasks,
  timeoffs,
});

// Types can be inferred from the schema declaration
export type Database = (typeof AppSchema)["types"];

export type TaskRecord = Database["tasks"];
export type PersonRecord = Database["people"];
export type TimeoffRecord = Database["timeoffs"];
