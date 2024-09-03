import { useQuery } from "@powersync/react";
import { PersonRecord, Tables } from "./1_AppSchema";

export function usePeople() {
  // In Powersync we get data thorugh reactive queries
  //
  // We can make this typesafe adding an ORM or a query builder (e.g. @powersync/kysely-driver)
  const { data: people } = useQuery<PersonRecord>(
    `SELECT ${Tables.People}.* FROM ${Tables.People} ORDER BY ${Tables.People}.created_at DESC`
  );

  return people;
}
