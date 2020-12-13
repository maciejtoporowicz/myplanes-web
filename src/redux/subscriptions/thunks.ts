import {createAsyncThunk} from "@reduxjs/toolkit";
import {getSettingsRepo} from "../../infrastructure/settings/SettingsRepo";
import {Subscription} from "./Subscription";
import {appConfig} from "../../infrastructure/config/appConfig";

export const fetchSubscriptions = createAsyncThunk('subscriptions/fetch', async (args: { clientId: string }): Promise<{
  subscriptions: Subscription[];
}> => {
  type SubscriptionResponse = {
    jobId: string;
    name: string;
    coordinates: string;
    boundaryOffsetNorth: string;
    boundaryOffsetEast: string;
    boundaryOffsetSouth: string;
    boundaryOffsetWest: string;
    altitudeThreshold: string;
  }

  const coordinatesFrom = (coordinatesAsString: string): { lat: number; lng: number; } => {
    const coordsSplit = coordinatesAsString.split(",").map(splitString => splitString.trim());

    return {
      lat: Number.parseFloat(coordsSplit[0]),
      lng: Number.parseFloat(coordsSplit[1]),
    }
  }

  const {clientId} = args;
  const response = await fetch(`${appConfig.apiUrl}/subscriptions/client/${clientId}`);
  const subscriptions = await response.json() as SubscriptionResponse[];
  return {
    subscriptions: subscriptions.map(sub => ({
      ...sub,
      coordinates: coordinatesFrom(sub.coordinates)
    }))
  };
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