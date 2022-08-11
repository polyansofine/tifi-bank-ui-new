import * as authAtions from "../../actions";

const initialState = {
  auth: {},
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case authAtions.LOGIN: {
      return { ...state, auth: action.payload };
    }
    case authAtions.LOGOUT: {
      return { ...state, auth: {} };
    }
    default:
      return state;
  }
};
export default auth;
