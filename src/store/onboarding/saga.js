import { call, put, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';
import * as actionTypes from './actionTypes';
import { submitOnboarding } from '../../services/api'; // Adjust the API function name as needed

function* submitFormSaga(action) {
  try {
    const { tenant, navigate } = action.payload;
    const response = yield call(submitOnboarding, tenant);
    yield put(actions.onboardingFormSuccess(response));
    navigate('/home');
  } catch (error) {
    yield put(actions.onboardingFormFailure(error.toString()));
  }
}

export default function* watchOnboardingSaga() {
  yield takeLatest(actionTypes.SUBMIT_ONBOARDING_FORM, submitFormSaga);
}
