import {
    CONNECT_SLACK_SUCCESS,
    CONNECT_SLACK_FAILURE,
    INITIALIZE_SLACK,
    DISCONNECT_SLACK_SUCCESS,
    DISCONNECT_SLACK_FAILURE
} from "./actionTypes";
  
const initialState = {
    connected: false,
    loading: false,
    error: null
};
  
export const slackReducer = (state = initialState, action) => {
    switch (action.type) {
        case CONNECT_SLACK_SUCCESS:
            return {
                ...state,
                connected: true,
                loading: false,
                error: null,
            };
        case CONNECT_SLACK_FAILURE:
            return {
                ...state,
                connected: false,
                loading: false,
                error: action.payload.error,
            };
        case INITIALIZE_SLACK:
            return {
                ...state,
                loading: false,
                error: null
            };
        case DISCONNECT_SLACK_SUCCESS:
            return {
                ...state,
                connected: false,
                loading: false,
                error: null,

            };
        case DISCONNECT_SLACK_FAILURE:
            return {
                ...state,
                connected: true,
                loading: false,
                error: action.payload.error
            };
        default:
            return state;
    }
};