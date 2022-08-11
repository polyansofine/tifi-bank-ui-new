import { combineReducers } from "redux";
import auth from "./auth.reducer";

const authReducers = combineReducers({
  auth,
});

export default authReducers;
