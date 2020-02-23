import { combineReducers } from "redux";

import { userSlice } from "../slice/setSlice";

export const appReducers = combineReducers({
  setUser: userSlice.reducer
});
