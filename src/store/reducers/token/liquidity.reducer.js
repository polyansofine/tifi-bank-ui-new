import * as tokenActions from "../../actions";
import { TOKENS } from "../../../config/token"

const initialState = {
    balances: [],
    remove: {},
    token0: TOKENS[0],
    token1: TOKENS[2],
};
const liquidity = (state = initialState, action) => {
    switch (action.type) {
        case tokenActions.GET_LIQUIDITY_BALANCES: {
            return {
                ...state,
                balances: action.payload,
            };
        }
        case tokenActions.SET_REMOVE: {
            return {
                ...state,
                remove: action.payload,
            };
        }
        case tokenActions.SET_TOKENS: {
            return {
                ...state,
                token0: action.payload.token0,
                token1: action.payload.token1,
            };
        }
        case tokenActions.UPDATE_BALANCE: {
            let selectedPair = state.balances.filter(item => item.address === action.payload.pairAddress)[0]
            selectedPair.balance = action.payload.balance;
            return {
                ...state,
                remove: {
                    ...state.remove,
                    balance: action.payload.balance,
                }
            };
        }
        default:
            return state;
    }
};
export default liquidity;
