import React from "react";
import { usePowerSync } from "@powersync/react";
import { useConnector } from "@/components/providers/SystemProvider";
import { Tables } from "@/lib/powersync/AppSchema";
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

export function AddPerson() {
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
        <Button className="fixed bottom-3 right-3">Add person</Button>
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
