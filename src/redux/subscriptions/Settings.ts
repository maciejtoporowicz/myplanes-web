import {JobId} from "../flights/JobId";

export type Settings = {
  jobId: JobId;
  notificationsEnabled: boolean;
}

export const defaultSettings = (jobId: string): Settings => ({
  jobId: jobId,
  notificationsEnabled: false
});