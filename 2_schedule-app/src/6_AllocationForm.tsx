import React from "react";
import { usePowerSync } from "@powersync/react";
import { PersonRecord, Tables } from "@/1_AppSchema";
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
import { useUserId } from "./lib/useUserId";

export function AllocationForm(props: {
  person: PersonRecord;
  date: string;
  children: React.ReactNode;
}) {
  const powerSync = usePowerSync();
  const userID = useUserId();

  const [open, setOpen] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const type = formData.get("type");

    if (typeof name !== "string") return;

    if (type === "task") {
      await powerSync.execute(
        `INSERT INTO ${Tables.Tasks} (id, created_at, person_id, owner_id, name, date) VALUES (uuid(), datetime(), ?, ?, ?, ?) RETURNING *`,
        [props.person.id, userID, name, props.date]
      );
    } else {
      await powerSync.execute(
        `INSERT INTO ${Tables.Timeoffs} (id, created_at, person_id, owner_id, name, date) VALUES (uuid(), datetime(), ?, ?, ?, ?) RETURNING *`,
        [props.person.id, userID, name, props.date]
      );
    }

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
              <div className="flex items-center gap-4 py-4">
                Type:
                <label className="flex items-center gap-1">
                  <input
                    autoFocus
                    name="type"
                    type="radio"
                    value={"task"}
                    required
                    defaultChecked
                  />
                  Task
                </label>
                <label className="flex items-center gap-1">
                  <input
                    autoFocus
                    name="type"
                    type="radio"
                    value={"timeoff"}
                    required
                  />
                  Timeoff
                </label>
              </div>
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
