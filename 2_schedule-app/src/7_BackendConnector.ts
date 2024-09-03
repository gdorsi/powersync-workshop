import { v4 as uuid } from "uuid";

import {
  AbstractPowerSyncDatabase,
  CrudEntry,
  PowerSyncBackendConnector,
  UpdateType,
} from "@powersync/web";

export type BackendConnectorConfig = {
  backendUrl: string;
  powersyncUrl: string;
};

export class BackendConnector implements PowerSyncBackendConnector {
  readonly config: BackendConnectorConfig;
  readonly userId: string;

  constructor() {
    this.userId = mockGetUserId();

    this.config = {
      backendUrl: import.meta.env.VITE_BACKEND_URL,
      powersyncUrl: import.meta.env.VITE_POWERSYNC_URL,
    };
  }

  // Need to gather a signed payload to send to Powersync as auth
  // This may also contain parameters we want to use to query the Powersync buckets
  async fetchCredentials() {
    const tokenEndpoint = "api/auth/token";
    const res = await fetch(
      `${this.config.backendUrl}/${tokenEndpoint}?user_id=${this.userId}`
    );

    if (!res.ok) {
      throw new Error(
        `Received ${res.status} from ${tokenEndpoint}: ${await res.text()}`
      );
    }

    const body = await res.json();

    return {
      endpoint: this.config.powersyncUrl,
      token: body.token,
    };
  }

  // In this function we transform the DB transactions into API calls
  async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
    const transaction = await database.getNextCrudTransaction();

    if (!transaction) {
      return;
    }

    // Note: If transactional consistency is important, use database functions
    // or edge functions to process the entire transaction in a single call.
    for (let operation of transaction.crud) {
      const operationType = operation.op; // Can be "PUT", "PATCH" or "DELETE"
      const { table } = operation; // The name of the table
      const { id } = operation; // The id of the affected row
      const { opData } = operation; // The operation payload

      switch (operationType) {
        case UpdateType.DELETE: {
          await fetchWrapper(this.config, UpdateType.DELETE, {
            table,
            data: {
              id,
            },
          });
          break;
        }
        case UpdateType.PUT: {
          await fetchWrapper(this.config, UpdateType.PUT, {
            table,
            data: {
              id,
              ...opData, // This is the full row data
            },
          });
          break;
        }
        case UpdateType.PATCH: {
          /**
           * This specific backend API is not very smart WRT `not null` columns.
           * We have to patch the entire payload to avoid attempting to set constrained columns to `null`.
           */
          const item = await database.get<any>(
            `SELECT * FROM ${table} WHERE id = ?`,
            [operation.id]
          );

          await fetchWrapper(this.config, UpdateType.PATCH, {
            table,
            data: {
              id,
              ...item, // This is the full data of the changed row
              ...opData, // This is the diff of the changes
            },
          });
          break;
        }
      }
    }

    await transaction.complete();
  }
}

/**
 * Walkthorugh continue on 3_schedule-backend/1_data.js
 */
const USER_ID_STORAGE_KEY = "ps_user_id";

function mockGetUserId() {
  let userId = localStorage.getItem(USER_ID_STORAGE_KEY);
  if (!userId) {
    userId = uuid();
    localStorage.setItem(USER_ID_STORAGE_KEY, userId);
  }

  return userId;
}

async function fetchWrapper(
  config: BackendConnectorConfig,
  operationType: CrudEntry["op"],
  payload: unknown
) {
  const response = await fetch(`${config.backendUrl}/api/data`, {
    method: operationType,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `Received ${response.status} from /api/data: ${await response.text()}`
    );
  }
}
