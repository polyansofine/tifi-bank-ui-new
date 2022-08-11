export const SET_SPEED = "SET_SPEED";
export const SET_TOLERANCE = "SET_TOLERANCE";
export const SET_DEADLINE = "SET_DEADLINE";
export const SET_EXPERT = "SET_EXPERT";
export const SET_MULTI = "SET_MULTI";
export const SET_INDICATOR = "SET_INDICATOR";

export const setSpeed = (speed) => async (dispatch) => {
    localStorage.setItem("speed", speed);
    dispatch({ type: SET_SPEED, payload: speed });
};

export const setTolerance = (tolerance) => async (dispatch) => {
    localStorage.setItem("tolerance", tolerance);
    dispatch({ type: SET_TOLERANCE, payload: Number(tolerance) });
};

export const setDeadline = (deadline) => async (dispatch) => {
    localStorage.setItem("deadline", deadline);
    dispatch({ type: SET_DEADLINE, payload: Number(deadline) });
};

export const setExpert = (expert) => async (dispatch) => {
    localStorage.setItem("expert", expert);
    dispatch({ type: SET_DEADLINE, payload: expert });
};

export const setMulti = (multi) => async (dispatch) => {
    localStorage.setItem("multi", multi);
    dispatch({ type: SET_DEADLINE, payload: multi });
};

export const setIndicator = (indicator) => async (dispatch) => {
    localStorage.setItem("indicator", indicator);
    dispatch({ type: SET_DEADLINE, payload: indicator });
};