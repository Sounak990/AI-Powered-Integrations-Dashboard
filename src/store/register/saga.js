import { call, put, takeLatest } from 'redux-saga/effects';
import { registerUserSuccessful, registerUserFailed } from './actions';
import { REGISTER_USER } from './actionTypes';
import { apiRegister } from '../../services/api'; // Assuming this is correct

// Worker saga: will be fired on REGISTER_USER actions
function* register({ payload: { user } }) {
  try {
    const response = yield call(apiRegister, user);
    yield put(registerUserSuccessful(response.data));
  } catch (error) {
    // Extract error message from FastAPI's response structure
    const errorMessage = error.response && error.response.data && error.response.data.detail
                          ? error.response.data.detail
                          : error.message || 'An unknown error occurred';
    yield put(registerUserFailed(errorMessage));
  }
}

export default function* registrationSaga() {
  yield takeLatest(REGISTER_USER, register);
}
