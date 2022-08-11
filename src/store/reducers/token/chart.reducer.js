import * as chartActions from "../../actions";

const initialState = {
    chart: {},
};
const chart = (state = initialState, action) => {
    switch (action.type) {
        case chartActions.GET_CHART_DATA: {
            return {
                ...state,
                chart: action.payload,
            };
        }

        default:
            return state;
    }
};
export default chart;
