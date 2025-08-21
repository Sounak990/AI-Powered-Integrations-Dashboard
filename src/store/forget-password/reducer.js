// reducer.js
import * as actionTypes from './actionTypes';

const initialState = {
    loading: false,
    message: null,
    error: null
};

const resetPasswordReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.RESET_PASSWORD_REQUEST:
            return { ...state, loading: true, message: null, error: null };
        case actionTypes.RESET_PASSWORD_SUCCESS:
            return { ...state, loading: false, message: action.payload, error: null };
        case actionTypes.RESET_PASSWORD_FAILURE:
            return { ...state, loading: false, message: null, error: action.payload };
        default:
            return state;
    }
};

export default resetPasswordReducer;
