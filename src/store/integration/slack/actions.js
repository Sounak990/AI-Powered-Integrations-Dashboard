import {
    CONNECT_SLACK_SUCCESS,
    CONNECT_SLACK_FAILURE,
    INITIALIZE_SLACK,
    DISCONNECT_SLACK_SUCCESS,
    DISCONNECT_SLACK_FAILURE,
} from "./actionTypes";
  
export const connectSlackSuccess = () => ({
    type: CONNECT_SLACK_SUCCESS,
});

export const connectSlackFailure = (error) => ({
    type: CONNECT_SLACK_FAILURE,
    payload: { error }
});

export const initializeSlack = () => ({
    type: INITIALIZE_SLACK
});

export const disconnectSlackSuccess = () => ({
    type: DISCONNECT_SLACK_SUCCESS
});

export const disconnectSlackFailure = (error) => ({
    type: DISCONNECT_SLACK_FAILURE,
    payload: { error }
});