import * as actionTypes from './actionTypes';

export const loginUser = (credentials, navigate) => ({
	type: actionTypes.LOGIN_REQUEST,
	payload: { credentials, navigate },
});

export const loginUserSuccess = (user) => ({
	type: actionTypes.LOGIN_SUCCESS,
	payload: user,
});

export const loginUserFailure = (error) => ({
	type: actionTypes.LOGIN_FAILURE,
	payload: error,
});

export const apiError = error => ({
	type: actionTypes.API_ERROR,
	payload: error,
});

export const logoutUser = () => ({
	type: actionTypes.LOGOUT,
});

export const refreshTokenRequest = () => ({
	type: actionTypes.REFRESH_TOKEN_REQUEST,
});

export const refreshTokenSuccess = (token) => ({
	type: actionTypes.REFRESH_TOKEN_SUCCESS,
	payload: token,
});

export const refreshTokenFailure = (error) => ({
	type: actionTypes.REFRESH_TOKEN_FAILURE,
	payload: error,
});

export const setTokenExpiration = (expirationTime) => ({
	type: actionTypes.SET_TOKEN_EXPIRATION,
	payload: expirationTime,
});