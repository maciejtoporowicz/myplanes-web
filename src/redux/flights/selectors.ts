import {RootState} from "../store";
import {createSelector} from "@reduxjs/toolkit";
import {flightsEntityAdapter, jobFlightsEntityAdapter, jobsEntityAdapter} from "./reducer";

export const flightsSelector = flightsEntityAdapter.getSelectors((state: RootState) => state.flightsData.flights);
export const jobFlightsSelector = jobFlightsEntityAdapter.getSelectors((state: RootState) => state.flightsData.jobFlights);
export const jobsSelector = jobsEntityAdapter.getSelectors((state: RootState) => state.flightsData.jobs);
const getIcao24sOfFlightsRelatedTo = (jobId: string) => (state: RootState) => jobFlightsSelector.selectAll(state)
  .filter(jobFlight => jobFlight.jobId === jobId)
  .map(jobFlight => jobFlight.icao24);
export const getFlightsForJob = (jobId: string) => createSelector(
  [flightsSelector.selectAll, getIcao24sOfFlightsRelatedTo(jobId)],
  (allFlights, icao24s) => allFlights.filter(flightData => icao24s.includes(flightData.icao24))
)
export const isLoading = (jobId: string) => (state: RootState) => (state.flightsData.jobDataLoadingByJobId[jobId] || 0) > 0;