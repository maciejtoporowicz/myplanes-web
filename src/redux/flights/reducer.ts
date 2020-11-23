import {createEntityAdapter, createSlice, EntityState} from "@reduxjs/toolkit";
import {LoadingState} from "../LoadingState";
import FlightData from "./FlightData";
import {JobFlight} from "./JobFlight";
import {JobData} from "./JobData";
import {JobId} from "./JobId";
import {fetchFlightsData} from "./thunks";

export const jobsEntityAdapter = createEntityAdapter({
  selectId: (job: JobData) => job.id,
  sortComparer: (jobA: JobData, jobB: JobData) => (jobA?.id || "").localeCompare(jobB?.id || "")
})

export const flightsEntityAdapter = createEntityAdapter({
  selectId: (flight: FlightData) => flight.icao24,
  sortComparer: (flightA: FlightData, flightB: FlightData) => (flightA?.icao24 || "").localeCompare(flightB?.icao24 || "")
});

export const jobFlightsEntityAdapter = createEntityAdapter({
  selectId: (jobFlight: JobFlight) => jobFlight.id,
  sortComparer: (jobFlightA: JobFlight, jobFlightB: JobFlight) => (jobFlightA?.id || "").localeCompare(jobFlightB?.id || "")
});

export type FlightState = {
  loading: LoadingState;
  jobDataLoadingByJobId: Record<JobId, number>;
  flights: EntityState<FlightData>,
  jobs: EntityState<JobData>,
  jobFlights: EntityState<JobFlight>
}

const initialState: FlightState = {
  loading: LoadingState.IDLE,
  jobDataLoadingByJobId: {},
  flights: flightsEntityAdapter.getInitialState(),
  jobs: jobsEntityAdapter.getInitialState(),
  jobFlights: jobFlightsEntityAdapter.getInitialState()
};

export const slice = createSlice({
  name: 'flights',
  initialState: initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(fetchFlightsData.pending, (state, { meta }) => {
      const jobId = meta.arg;

      state.loading = LoadingState.LOADING;
      state.jobDataLoadingByJobId[jobId] = (state.jobDataLoadingByJobId[jobId] || 0) + 1;
    });
    builder.addCase(fetchFlightsData.fulfilled, (state, { payload }) => {
      const { data, updatedAt, jobId } = payload;

      const relatedJobFlightIds = state.jobFlights
        .ids
        .filter(id => state.jobFlights.entities[id]?.jobId === jobId);

      jobFlightsEntityAdapter.removeMany(state.jobFlights, relatedJobFlightIds);

      jobsEntityAdapter.upsertOne(state.jobs, { id: jobId, updatedAt: updatedAt });
      flightsEntityAdapter.upsertMany(state.flights, payload.data);
      jobFlightsEntityAdapter.upsertMany(state.jobFlights, data.map(dataItem => ({
        id: `${jobId}/${dataItem.icao24}`,
        icao24: dataItem.icao24,
        jobId: jobId
      })));

      const icao24OfAllKnownFlights = state.flights.ids as string[];

      const icao24OfFlightsWithRelatedJobs = state.jobFlights
        .ids
        .map(id => state.jobFlights.entities[id]?.icao24 || "")
        .filter(item => item !== "");

      const icao24OfFlightsWithNoRelatedJobs = icao24OfAllKnownFlights
        .filter(icao24 => !icao24OfFlightsWithRelatedJobs.includes(icao24));

      flightsEntityAdapter.removeMany(state.flights, icao24OfFlightsWithNoRelatedJobs);

      state.loading = LoadingState.SUCCESS;
      state.jobDataLoadingByJobId[jobId] = (state.jobDataLoadingByJobId[jobId] ? state.jobDataLoadingByJobId[jobId] - 1 : 0);
    });
  }
})

const { reducer } = slice;

export default reducer;