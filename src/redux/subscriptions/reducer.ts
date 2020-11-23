import {createEntityAdapter, createSlice, EntityState} from "@reduxjs/toolkit";
import {LoadingState} from "../LoadingState";
import {Subscription} from "./Subscription";
import {defaultSettings, Settings} from "./Settings";
import {JobId} from "../flights/JobId";
import {fetchSubscriptions, loadSettings, updatePushNotificationEnabled} from "./thunks";

export const subscriptionEntityAdapter = createEntityAdapter({
  selectId: (subscription: Subscription) => subscription.jobId,
  sortComparer: (subscriptionA: Subscription, subscriptionB: Subscription) => subscriptionA.name.localeCompare(subscriptionB.name)
});

export const settingsEntityAdapter = createEntityAdapter({
  selectId: (settings: Settings) => settings.jobId,
  sortComparer: (settingsA: Settings, settingsB: Settings) => (settingsA?.jobId || "").localeCompare(settingsB?.jobId || "")
});

export type SubscriptionState = {
  loading: LoadingState;
  updatedAt: string | undefined;
  subscriptions: EntityState<Subscription>;
  settings: EntityState<Settings> & {
    jobSettingsLoading: Record<JobId, boolean>,
    settingsLoading: LoadingState
  };
}

const initialState: SubscriptionState = {
  loading: LoadingState.IDLE,
  updatedAt: undefined,
  subscriptions: subscriptionEntityAdapter.getInitialState(),
  settings: {
    jobSettingsLoading: {},
    settingsLoading: LoadingState.IDLE,
    ...settingsEntityAdapter.getInitialState()
  }
};

export const slice = createSlice({
  name: 'flights',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchSubscriptions.pending, (state) => {
      state.loading = LoadingState.LOADING;
    });
    builder.addCase(fetchSubscriptions.fulfilled, (state, {payload}) => {
      state.loading = LoadingState.SUCCESS;
      subscriptionEntityAdapter.setAll(state.subscriptions, payload.subscriptions);
    });
    builder.addCase(updatePushNotificationEnabled.pending, (state, {meta}) => {
      const { jobId } = meta.arg;

      state.settings.jobSettingsLoading[jobId] = true;
    });
    builder.addCase(updatePushNotificationEnabled.fulfilled, (state, {payload, meta}) => {
      const { jobId } = meta.arg;

      const baseEntity = settingsEntityAdapter.getSelectors().selectById(state.settings, jobId) || defaultSettings(jobId);

      settingsEntityAdapter.upsertOne(state.settings, {
        ...baseEntity,
        notificationsEnabled: payload.areEnabled
      });

      state.settings.jobSettingsLoading[jobId] = false;
    });
    builder.addCase(loadSettings.pending, (state) => {
      state.settings.settingsLoading = LoadingState.LOADING;
    });
    builder.addCase(loadSettings.fulfilled, (state, { payload }) => {
      state.settings.settingsLoading = LoadingState.SUCCESS;
      settingsEntityAdapter.setAll(state.settings, payload.map(settings => ({
        jobId: settings.jobId,
        notificationsEnabled: settings.pushNotificationsEnabled
      })));
    });
  }
})

const {reducer} = slice;

export default reducer;