import {createAsyncThunk} from "@reduxjs/toolkit";
import FlightData from "./FlightData";
import {appConfig} from "../../infrastructure/config/appConfig";

export const fetchFlightsData = createAsyncThunk('flights/fetchOne', async (jobId: string): Promise<{
  jobId: string;
  updatedAt?: string;
  data: FlightData[];
}> => {
  const response = await fetch(`${appConfig.apiUrl}/flightData/${jobId}`);

  if (response.status === 404) {
    return {
      jobId: jobId,
      data: []
    }
  }

  return await response.json()
});