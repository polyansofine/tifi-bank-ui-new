import { combineReducers } from "redux";
import token from "./token.reducer";
import liquidity from "./liquidity.reducer";
import chart from "./chart.reducer";

const fuseReducers = combineReducers({
  token,
  liquidity,
  chart,
});

export default fuseReducers;
