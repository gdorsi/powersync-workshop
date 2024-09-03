import { AppSchema } from "@/1_AppSchema";
import { BackendConnector } from "@/7_BackendConnector";
import { PowerSyncContext } from "@powersync/react";
import { WASQLitePowerSyncDatabaseOpenFactory } from "@powersync/web";
import React, { Suspense } from "react";

// This manages the persistence on the client
// we use a SQLite DB modified to allow us to subscribe to queries
export const db = new WASQLitePowerSyncDatabaseOpenFactory({
  dbFilename: "schedule.db",
  schema: AppSchema,
}).getInstance();

// The connector manages auth and the upload of the changes done locally
const ConnectorContext = React.createContext<BackendConnector | null>(null);
export const useConnector = () => React.useContext(ConnectorContext);

export const SystemProvider = ({ children }: { children: React.ReactNode }) => {
  const [connector] = React.useState(new BackendConnector());
  const [powerSync] = React.useState(db);

  React.useEffect(() => {
    powerSync.init();
    powerSync.connect(connector);
  }, [powerSync, connector]);

  return (
    <Suspense fallback={"Loading..."}>
      <PowerSyncContext.Provider value={powerSync}>
        <ConnectorContext.Provider value={connector}>
          {children}
        </ConnectorContext.Provider>
      </PowerSyncContext.Provider>
    </Suspense>
  );
};

export default SystemProvider;
