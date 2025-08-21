// In saga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from './actionTypes';
import * as actions from './actions';
import { submitSupportFormApi } from '../../services/api';

function* submitSupportFormSaga(action) {
  try {
    const { formData, tenantId, username } = action.payload;
    const response = yield call(submitSupportFormApi, formData, tenantId, username);
    yield put(actions.supportFormSuccess(response.message));
  } catch (error) {
    yield put(actions.supportFormFailure(error.response?.data?.error || 'An error occurred'));
  }
}

export default function* watchSupportForm() {
  yield takeLatest(actionTypes.SUBMIT_SUPPORT_FORM, submitSupportFormSaga);
}
