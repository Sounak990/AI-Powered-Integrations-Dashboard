import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import * as actionTypes from './actionTypes';
import * as actions from './actions';
import { apiLogin, apiRefreshToken } from '../../services/api';

const TOKEN_TTL = 2 * 24 * 60 * 60 * 1000; // 2 days

function* handleLogin(action) {
	console.log('handleLogin saga started with action:', action);

	try {
		const { credentials, navigate } = action.payload;
		const response = yield call(apiLogin, credentials);
		console.log('Login API response:', response);

		// Dispatch success action
		yield put(actions.loginUserSuccess(response));
		localStorage.setItem('authUser', JSON.stringify(response));

		const expiresAt = new Date().getTime() + TOKEN_TTL;
		yield put(actions.setTokenExpiration(expiresAt));

		// Store the expiration time in the Redux state
		// const expirationTime = new Date(response.expires_at).getTime();
		// yield put(actions.setTokenExpiration(expirationTime));

		// Check if the token is already expired
		// if (expirationTime <= new Date().getTime()) {
		// 	alert('Your session has expired. You will be redirected to the login page.');
		// 	yield put(actions.logoutUser());
		// 	navigate('/login');
		// 	return;
		// }

		// // Set up a timer to check token expiration
		// yield call(setupTokenExpirationTimer, expirationTime);

		// Navigate based on the has_onboarded value in the response
		if (response.has_onboarded) {
			console.log('User has onboarded, navigating to dashboard');
			navigate('/home');
		} else {
			console.log('User has not onboarded, navigating to onboarding');
			navigate('/onboarding');
		}
	} catch (error) {
		console.error('Login error:', error);
		const errorMessage = error.response?.data?.detail || error.message;

		// Dispatch failure action
		yield put(actions.loginUserFailure(errorMessage));
	}

	console.log('handleLogin saga finished');
}

// function* setupTokenExpirationTimer(expirationTime) {
// 	const currentTime = new Date().getTime();
// 	const timeLeft = expirationTime - currentTime;
// 	const warningTime = timeLeft - 5 * 60 * 1000; // 5 minutes before expiration

// 	const warningTimer = setTimeout(() => {
// 		alert('Your session is about to expire. Please refresh your token.');
// 	}, warningTime);

// 	const expirationTimer = setTimeout(() => {
// 		alert('Your session has expired. You will be redirected to the login page.');
// 		// yield put(actions.logoutUser());
// 		// history.push('/login');
// 	}, timeLeft);

// 	return () => {
// 		clearTimeout(warningTimer);
// 		clearTimeout(expirationTimer);
// 	};
// }

function* handleRefreshToken() {
	try {
		console.log('Refreshing token');
		const response = yield call(apiRefreshToken);

		yield put(actions.refreshTokenSuccess(response.access_token));

		// Reset the token expiration timer
		const expiresAt = new Date().getTime() + TOKEN_TTL;

		yield put(actions.setTokenExpiration(expiresAt));
		localStorage.setItem('authUser', JSON.stringify({ ...JSON.parse(localStorage.getItem('authUser')), access_token: response.access_token }));

		// yield call(setupTokenExpirationTimer, expirationTime);
	} catch (error) {
		console.log('Refresh token failed:', error.message);
		yield put(actions.refreshTokenFailure(error.message));
	}
	console.log('handleRefreshToken saga finished');
}

function* handleLogout() {
	console.log('Logging out user');
	localStorage.removeItem('authUser');
}

export default function* loginSaga() {
	yield takeLatest(actionTypes.LOGIN_REQUEST, handleLogin);
	yield takeLatest(actionTypes.REFRESH_TOKEN_REQUEST, handleRefreshToken);
	yield takeLatest(actionTypes.LOGOUT, handleLogout);
}