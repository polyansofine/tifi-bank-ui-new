export const GET_LIQUIDITY_BALANCES = "GET_LIQUIDITY_BALANCES";
export const SET_REMOVE = "SET_REMOVE";
export const SET_TOKENS = "SET_TOKENS";
export const UPDATE_BALANCE = "UPDATE_BALANCE";

export const getLiquidityBalance = (val) => async (dispatch) => {
    dispatch({ type: GET_LIQUIDITY_BALANCES, payload: val });
};
export const setRemove = (val) => async (dispatch) => {
    dispatch({ type: SET_REMOVE, payload: val });
};

export const setTokens = (token0, token1) => async (dispatch) => {
    dispatch({ type: SET_TOKENS, payload: { token0, token1 } });
};

export const updateBalance = (pairAddress, balance) => async (dispatch) => {
    dispatch({ type: UPDATE_BALANCE, payload: { pairAddress, balance } });
}