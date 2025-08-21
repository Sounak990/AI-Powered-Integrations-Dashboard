// actions.js
import * as actionTypes from './actionTypes';

export const resetPassword = (email) => ({
    type: actionTypes.RESET_PASSWORD_REQUEST,
    payload: email
});

export const resetPasswordSuccess = (message) => ({
    type: actionTypes.RESET_PASSWORD_SUCCESS,
    payload: message
});

export const resetPasswordFailure = (error) => ({
    type: actionTypes.RESET_PASSWORD_FAILURE,
    payload: error
});
