import { column, Schema, TableV2 } from "@powersync/web";

export enum Tables {
  People = "people",
  Tasks = "tasks",
}

const tasks = new TableV2(
  {
    owner_id: column.text,
    created_at: column.text,
    name: column.text,
    completed: column.integer,
    start_date: column.text,
    end_date: column.text,
    person_id: column.text,
  },
  { indexes: { list: ["person_id", "owner_id", "start_date", "end_date"] } }
);

const people = new TableV2({
  created_at: column.text,
  name: column.text,
  owner_id: column.text,
});

export const AppSchema = new Schema({
  people,
  tasks,
});

export type Database = (typeof AppSchema)["types"];
export type TaskRecord = Database["tasks"];
// OR:
// export type Todo = RowType<typeof todos>;

export type PersonRecord = Database["people"];
