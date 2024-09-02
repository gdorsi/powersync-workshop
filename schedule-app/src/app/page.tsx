import { PersonRecord, Tables, TaskRecord } from "@/lib/powersync/AppSchema";
import { usePowerSync, useQuery } from "@powersync/react";
import React from "react";
import { Schedule } from "../components/Schedule";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useConnector } from "@/components/providers/SystemProvider";
import { Input } from "@/components/ui/input";

export function MainPage() {
  const { data: people } = useQuery<PersonRecord>(
    `SELECT ${Tables.People}.* FROM ${Tables.People}`
  );

  const { data: tasks } = useQuery<TaskRecord>(
    `SELECT ${Tables.Tasks}.* FROM ${Tables.Tasks}`
  );

  return (
    <>
      <AddPerson />
      <pre>
        {JSON.stringify(people, null, 2)}
        {JSON.stringify(tasks, null, 2)}
      </pre>
      <Schedule people={people} tasks={tasks} />
    </>
  );
}

function AddPerson() {
  const powerSync = usePowerSync();
  const connector = useConnector();

  const createNewPerson = async (name: string) => {
    const userID = connector?.userId;

    if (!userID) {
      throw new Error(`Could not create new people, no userID found`);
    }

    const res = await powerSync.execute(
      `INSERT INTO ${Tables.People} (id, created_at, name, owner_id) VALUES (uuid(), datetime(), ?, ?) RETURNING *`,
      [name, userID]
    );

    const resultRecord = res.rows?.item(0);
    if (!resultRecord) {
      throw new Error("Could not create person");
    }
  };

  const [open, setOpen] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");

    if (typeof name !== "string") return;

    await createNewPerson(name);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add person</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add person</DialogTitle>
          <DialogDescription asChild>
            <form id="add-person-form" onSubmit={handleSubmit}>
              <label>
                Name
                <Input autoFocus name="name" type="text" required />
              </label>
            </form>
          </DialogDescription>
          <DialogFooter>
            <Button form="add-person-form" type="submit">
              Submit
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
