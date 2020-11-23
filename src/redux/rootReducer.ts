import { combineReducers } from '@reduxjs/toolkit'
import clientData from "./client/reducer";
import flightsData from "./flights/reducer";
import subscriptionsData from "./subscriptions/reducer";

const rootReducer = combineReducers({
    clientData,
    flightsData,
    subscriptionsData
})

export default rootReducer;