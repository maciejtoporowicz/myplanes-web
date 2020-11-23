import {RootState} from "../store";

export const getClientId = (state: RootState) => state.clientData.clientId;