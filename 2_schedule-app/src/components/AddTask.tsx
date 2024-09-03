import React from "react";
import { usePowerSync } from "@powersync/react";
import { useConnector } from "@/components/providers/SystemProvider";
import { PersonRecord, Tables } from "@/lib/powersync/AppSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dateToString } from "@/lib/dates";

export function AddTask(props: {
  person: PersonRecord;
  date: string;
  children: React.ReactNode;
}) {
  const powerSync = usePowerSync();
  const connector = useConnector();

  const createNewTask = async (name: string) => {
    const userID = connector?.userId;

    if (!userID) {
      throw new Error(`Could not create new task, no userID found`);
    }

    const res = await powerSync.execute(
      `INSERT INTO ${Tables.Tasks} (id, created_at, person_id, owner_id, name, start_date, end_date) VALUES (uuid(), datetime(), ?, ?, ?, ?, ?) RETURNING *`,
      [props.person.id, userID, name, props.date, props.date]
    );

    const resultRecord = res.rows?.item(0);
    if (!resultRecord) {
      throw new Error("Could not create task");
    }
  };

  const [open, setOpen] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");

    if (typeof name !== "string") return;

    await createNewTask(name);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add task to {props.person.name}</DialogTitle>
          <DialogDescription asChild>
            <form id="add-task-form" onSubmit={handleSubmit}>
              <label>
                Name
                <Input autoFocus name="name" type="text" required />
              </label>
            </form>
          </DialogDescription>
          <DialogFooter>
            <Button form="add-task-form" type="submit">
              Submit
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
