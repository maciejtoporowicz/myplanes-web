import {RootState} from "../store";
import {settingsEntityAdapter, subscriptionEntityAdapter} from "./reducer";

export const subscriptionsSelector = subscriptionEntityAdapter.getSelectors((state: RootState) => state.subscriptionsData.subscriptions);
export const settingsSelector = settingsEntityAdapter.getSelectors((state: RootState) => state.subscriptionsData.settings);
export const areSettingsBeingChanged = (jobId: string) => (state: RootState) => (state.subscriptionsData.settings.jobSettingsLoading[jobId] || false);
export const selectSettingsById = (jobId: string) => (state: RootState) => settingsSelector.selectById(state, jobId) || {
  jobId: jobId,
  notificationsEnabled: false
};