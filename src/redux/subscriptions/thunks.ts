import {createAsyncThunk} from "@reduxjs/toolkit";
import {getSettingsRepo} from "../../infrastructure/settings/SettingsRepo";
import {Subscription} from "./Subscription";
import {appConfig} from "../../infrastructure/config/appConfig";

export const fetchSubscriptions = createAsyncThunk('subscriptions/fetch', async (args: { clientId: string }): Promise<{
  subscriptions: Subscription[];
}> => {
  const {clientId} = args;
  const response = await fetch(`${appConfig.apiUrl}/subscriptions/client/${clientId}`);
  const subscriptions = await response.json();
  return {subscriptions};
});
export const updatePushNotificationEnabled = createAsyncThunk('settings/updatePushNotificationEnabled', async (args: { jobId: string; areEnabled: boolean; }): Promise<{
  areEnabled: boolean
}> => {
  const {jobId, areEnabled} = args;

  const settingsRepo = await getSettingsRepo();
  await settingsRepo.updatePushNotificationSettingFor(jobId, areEnabled);

  return {
    areEnabled: areEnabled
  }
});
export const loadSettings = createAsyncThunk("settings/fetchAll", async () => {
  const settingsRepo = await getSettingsRepo();
  return settingsRepo.getAll();
});