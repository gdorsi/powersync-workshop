import { AppSchema } from "@/library/powersync/AppSchema";
import { DemoConnector } from "@/library/powersync/DemoConnector";
import { PowerSyncContext } from "@powersync/react";
import { WASQLitePowerSyncDatabaseOpenFactory } from "@powersync/web";
import React, { Suspense } from "react";

export const db = new WASQLitePowerSyncDatabaseOpenFactory({
  dbFilename: "schedule.db",
  schema: AppSchema,
}).getInstance();

const ConnectorContext = React.createContext<DemoConnector | null>(null);
export const useConnector = () => React.useContext(ConnectorContext);

export const SystemProvider = ({ children }: { children: React.ReactNode }) => {
  const [connector] = React.useState(new DemoConnector());
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
