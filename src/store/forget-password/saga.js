// sagas.js
import { takeLatest, call, put } from 'redux-saga/effects';
import * as actionTypes from './actionTypes';
import * as actions from './actions';
import { resetPasswordRequest } from '../../services/api';

function* resetPasswordSaga(action) {
    try {
        const response = yield call(resetPasswordRequest, action.payload);
        if (response.status === 200) {
            yield put(actions.resetPasswordSuccess(response.data.message));
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message;
        yield put(actions.resetPasswordFailure(errorMessage));
    }
}
export default function* watchResetPasswordSaga() {
    yield takeLatest(actionTypes.RESET_PASSWORD_REQUEST, resetPasswordSaga);
}