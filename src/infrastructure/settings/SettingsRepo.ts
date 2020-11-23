import {openDB, DBSchema, IDBPDatabase} from 'idb';
import {JobId} from "./JobId";
import {Settings} from "./Settings";

const OBJECT_STORE_PUSH_NOTIFICATIONS = "push-notifications";

interface PlanesDb extends DBSchema {
  [OBJECT_STORE_PUSH_NOTIFICATIONS]: {
    value: {
      jobId: JobId;
      pushNotificationsEnabled: boolean;
    };
    key: JobId;
  };
}

let memoizedRepo: SettingsRepo;

export async function getSettingsRepo(): Promise<SettingsRepo> {
  if(memoizedRepo) {
    return memoizedRepo;
  }

  const db = await openDB<PlanesDb>('myplanes-db', 1, {
    upgrade(db) {
      db.createObjectStore(OBJECT_STORE_PUSH_NOTIFICATIONS, {
        keyPath: 'jobId',
      });
    },
  });

  memoizedRepo = new SettingsRepo(db);

  return memoizedRepo;
}

class SettingsRepo {
  private readonly db: IDBPDatabase<PlanesDb>;

  constructor(db: IDBPDatabase<PlanesDb>) {
    this.db = db;
  }

  async updatePushNotificationSettingFor(jobId: JobId, isEnabled: boolean) {
    return this.db.put(OBJECT_STORE_PUSH_NOTIFICATIONS, { jobId: jobId, pushNotificationsEnabled: isEnabled });
  }

  async get(jobId: string): Promise<Settings | undefined> {
    return this.db.get(OBJECT_STORE_PUSH_NOTIFICATIONS, jobId);
  }

  async getAll(): Promise<Settings[]> {
    return this.db.getAll(OBJECT_STORE_PUSH_NOTIFICATIONS);
  }
}