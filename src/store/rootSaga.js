import { all, fork } from 'redux-saga/effects';
import loginSaga from './login/saga';
import LayoutSaga from './layout/saga';
import registrationSaga from './register/saga';
import watchOnboardingSaga from './onboarding/saga';
import watchSupportForm from './support/saga';
import chatSaga from './chat/saga';
import SalesScenarioSaga from './scenario/saga';
import conversationSaga from './conversation/saga';
import conversationPlaygroundSaga from './playground/saga';
import kbSaga from './kb/saga';
import watchSSE from './Notifications/saga';
import watchFetchUserBotData from './bot/saga';
import watchSalesforceConnection from './integration/salesforce/saga';
import watchSlackConnection from './integration/slack/saga';
import watchResetPasswordSaga from './forget-password/saga';
// Import other sagas

export default function* rootSaga() {
	yield all([
		fork(loginSaga),
		fork(LayoutSaga),
		fork(registrationSaga),
		fork(watchOnboardingSaga),
		fork(watchSupportForm),
		fork(chatSaga),
		fork(SalesScenarioSaga),
		fork(conversationSaga),
		fork(conversationPlaygroundSaga),
		fork(kbSaga),
		fork(watchSSE),
		fork(watchFetchUserBotData),
		fork(watchSalesforceConnection),
		fork(watchSlackConnection),
		fork(watchResetPasswordSaga),
		// other sagas go here
	]);
}