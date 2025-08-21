import { call, put, takeLatest } from 'redux-saga/effects';
import { setBotData } from './actions';
import { fetchUserBotData } from '@/services/api';
import { FETCH_USER_BOT_DATA } from './actionTypes';

// Worker saga: fetch the user bot data
function* fetchUserBotDataSaga(action) {
    const { tenantId, username } = action.payload;
    try {
        console.log(`Saga: Fetching bot data for tenantId=${tenantId}, username=${username}`);
        const data = yield call(fetchUserBotData, tenantId, username);
        console.log('Saga Bot Data:', data);
        yield put(setBotData(data)); // Dispatch the action to save data in Redux
    } catch (error) {
        console.error('Saga: Error fetching bot data:', error);
    }
}

// Watcher saga: watches for actions dispatched to the store, starts worker saga
function* watchFetchUserBotData() {
    yield takeLatest(FETCH_USER_BOT_DATA, fetchUserBotDataSaga);
}

export default watchFetchUserBotData;