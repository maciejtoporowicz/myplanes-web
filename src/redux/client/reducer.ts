import {createSlice} from "@reduxjs/toolkit";
import {clientRepo} from "../../infrastructure/client/ClientRepo";
import {logIn, logOut} from "./thunks";

export type ClientState = {
  clientId: string | undefined;
}

const initialState: ClientState = {
  clientId: clientRepo.getId(),
};

export const slice = createSlice({
  name: 'client',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(logIn.fulfilled, (state, {meta}) => {
      state.clientId = meta.arg.clientId;
    });
    builder.addCase(logOut.fulfilled, (state) => {
      state.clientId = undefined;
    });
  }
})

const {reducer} = slice;

export default reducer;