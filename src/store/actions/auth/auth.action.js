export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const login = (address, provider) => async (dispatch) => {
  const auth_data = {
    address,
    provider,
  };
  dispatch({ type: LOGIN, payload: auth_data });
};
export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT });
};
