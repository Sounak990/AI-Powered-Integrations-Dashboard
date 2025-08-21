import { put, takeLatest, call } from 'redux-saga/effects';
import * as actionTypes from './actionTypes';
import * as actions from './actions';
import { fetchSalesScenarioApi } from '../../services/api'; // Define this API function

function* fetchSalesScenarioSaga() {
  try {
    const data = yield call(fetchSalesScenarioApi);
    yield put(actions.fetchSalesScenarioSuccess(data));
  } catch (error) {
    yield put(actions.fetchSalesScenarioFailure(error));
  }
}

export default function* SalesScenarioSaga() {
  yield takeLatest(actionTypes.FETCH_SALES_SCENARIO_REQUEST, fetchSalesScenarioSaga);
}
