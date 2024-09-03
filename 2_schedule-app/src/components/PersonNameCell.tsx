import { PersonRecord } from "@/1_AppSchema";

export function PersonNameCell({ person }: { person: PersonRecord }) {
  return (
    <div className="sticky h-full w-[100px] left-0 top-0 inline-block z-10 bg-white border-solid border-2 border-black">
      <div className="flex h-full justify-center items-center">
        {person.name}
      </div>
    </div>
  );
}
