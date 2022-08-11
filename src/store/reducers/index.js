import { combineReducers } from "redux";
import fuseReducers from "./fuse/index";
import authReducers from "./auth";
import tokenReducers from "./token";
import settingReducers from "./setting";
const createReducer = (asyncReducers) =>
  combineReducers({
    fuseReducers,
    authReducers,
    tokenReducers,
    settingReducers,
    ...asyncReducers,
  });

export default createReducer;
