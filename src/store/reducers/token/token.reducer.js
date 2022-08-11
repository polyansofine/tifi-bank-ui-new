import { TOKENS } from "../../../config/token";
import * as tokenActions from "../../actions";

const initialState = {
  token0: TOKENS[0],
  token1: TOKENS[2],
  reserve0: null,
  reserve1: null,
};
const token = (state = initialState, action) => {
  switch (action.type) {
    case tokenActions.SELECT_TOKEN: {
      return {
        ...state,
        token0: action.payload.token0 ? action.payload.token0 : state.token0,
        token1: action.payload.token1 ? action.payload.token1 : state.token1,
      };
    }
    case tokenActions.GET_RESERVES: {
      return {
        ...state,
        reserve0: action.payload.token0,
        reserve1: action.payload.token1,
      };
    }

    default:
      return state;
  }
};
export default token;
