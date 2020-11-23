import {createAsyncThunk} from "@reduxjs/toolkit";
import {clientRepo} from "../../infrastructure/client/ClientRepo";

export const logIn = createAsyncThunk('client/logIn', async (args: { clientId: string }): Promise<void> => {
  const {clientId} = args;

  clientRepo.setId(clientId);
});
export const logOut = createAsyncThunk('client/logOut', async (): Promise<void> => {
  clientRepo.clear();
});