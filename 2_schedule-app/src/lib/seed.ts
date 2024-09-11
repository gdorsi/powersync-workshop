import { PersonRecord, Tables, TaskRecord } from "@/1_AppSchema";
import { AbstractPowerSyncDatabase } from "@powersync/web";
import { faker } from "@faker-js/faker";
import { addDays, differenceInDays } from "date-fns";
import { dateToString } from "./dates";

const PEOPLE_COUNT = 10;
const TASK_START = new Date("2024-06-01");
const TASK_END = new Date("2024-10-31");

function chunks<V>(values: V[], size: number) {
  const res: V[][] = [];

  for (let i = 0; i < values.length; i += size) {
    res.push(values.slice(i, i + size));
  }

  return res;
}

async function createPerson(
  powerSync: AbstractPowerSyncDatabase,
  userID: string
) {
  const result = await powerSync.execute(
    `INSERT INTO ${Tables.People} (id, created_at, name, owner_id) VALUES (uuid(), datetime(), ?, ?) RETURNING *`,
    [faker.person.fullName(), userID]
  );

  return result.rows?.item(0) as PersonRecord;
}

export async function seed(
  powerSync: AbstractPowerSyncDatabase,
  userID: string
) {
  const people = await powerSync.getAll<PersonRecord>(
    `SELECT ${Tables.People}.* FROM ${Tables.People}`
  );

  const peopleToGenerate = PEOPLE_COUNT - people.length;

  for (let i = 0; i < peopleToGenerate; i++) {
    people.push(await createPerson(powerSync, userID));
  }

  const timeRange = differenceInDays(TASK_END, TASK_START);

  for (const chunk of chunks(people, 20)) {
    const tasksToAdd: { date: string; person: PersonRecord }[] = [];

    console.log("processing task chunk", chunk);

    for (const person of people) {
      for (let i = 0; i <= timeRange; i++) {
        const date = dateToString(addDays(TASK_START, i));
        const tasks = await powerSync.getAll<TaskRecord>(
          `SELECT ${Tables.Tasks}.* FROM ${Tables.Tasks} WHERE ${Tables.Tasks}.date = ? AND ${Tables.Tasks}.person_id = ?`,
          [date, person.id]
        );

        if (!tasks.length) {
          tasksToAdd.push({
            date,
            person,
          });
        }
      }
    }

    await powerSync.execute(
      `INSERT INTO ${Tables.Tasks} (id, created_at, person_id, owner_id, name, date) VALUES` +
        tasksToAdd
          .map(
            (task) =>
              `(uuid(), datetime(), '${
                task.person.id
              }', '${userID}', '${faker.word.sample()}', '${task.date}')`
          )
          .join(", "),
      []
    );
  }

  console.log("done");
}
