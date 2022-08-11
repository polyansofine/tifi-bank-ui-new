import * as settingActions from "../../actions";
const initialState = {
    speed: Number(localStorage.getItem("speed")) || 5,
    tolerance: Number(localStorage.getItem("tolerance")) || 1,
    deadline: Number(localStorage.getItem("deadline")) || 20,
    multi: false,
    expert: false,
    indicator: false,
};

const setting = (state = initialState, action) => {
    switch (action.type) {
        case settingActions.SET_SPEED: {
            return {
                ...state,
                speed: action.payload,
            };
        }
        case settingActions.SET_TOLERANCE: {
            return {
                ...state,
                tolerance: action.payload,
            };
        }
        case settingActions.SET_DEADLINE: {
            return {
                ...state,
                deadline: action.payload,
            };
        }
        case settingActions.SET_EXPERT: {
            return {
                ...state,
                expert: action.payload,
            };
        }
        case settingActions.SET_MULTI: {
            return {
                ...state,
                multi: action.payload,
            };
        }
        case settingActions.SET_INDICATOR: {
            return {
                ...state,
                indicator: action.payload,
            };
        }

        default:
            return state;
    }
};
export default setting;
