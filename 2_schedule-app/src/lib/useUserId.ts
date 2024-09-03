import { useConnector } from "@/2_SystemProvider";

export function useUserId() {
  const connector = useConnector();

  const userID = connector?.userId;

  if (!userID) {
    throw new Error(`Not authenticated`);
  }

  return userID;
}
