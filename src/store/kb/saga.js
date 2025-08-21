import { call, put, takeEvery } from 'redux-saga/effects';
import { FETCH_KB_REQUEST, FETCH_KB_SUCCESS, FETCH_KB_FAILURE } from './actionTypes';
import { fetchKBByTenant } from '../../services/api';

function* fetchKBSaga(action) {
  try {
    const { tenantId } = action.payload;
    const data = yield call(fetchKBByTenant, tenantId);
    yield put({ type: FETCH_KB_SUCCESS, payload: { data } });
  } catch (error) {
    yield put({ type: FETCH_KB_FAILURE, payload: { error } });
  }
}

function* kbSaga() {
  yield takeEvery(FETCH_KB_REQUEST, fetchKBSaga);
}

export default kbSaga;
