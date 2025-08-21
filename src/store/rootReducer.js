import { combineReducers } from 'redux';
import loginReducer from './login/reducer';
import Layout from './layout/reducer';
import account from './register/reducer';
import onboardingReducer from './onboarding/reducer';
import supportReducer from './support/reducer';
import chatReducer from './chat/reducer';
import salesScenarioReducer from './scenario/reducer';
import conversationReducer from './conversation/reducer';
import conversationPlaygroundReducer from './playground/reducer';
import kbReducer from './kb/reducer';
import notificationReducer from './Notifications/reducer';
import botReducer from './bot/reducer';
import { salesforceReducer } from './integration/salesforce/reducer';
import { slackReducer } from './integration/slack/reducer';
import resetPasswordReducer from './forget-password/reducer';
// Import other reducers and combine them here

const rootReducer = combineReducers({
  login: loginReducer,
  Layout: Layout,
  Account: account,
  onboardingReducer: onboardingReducer,
  supportReducer:supportReducer,
  chatReducer:chatReducer,
  salesScenarioReducer: salesScenarioReducer,
  conversationReducer:conversationReducer,
  conversationPlaygroundReducer: conversationPlaygroundReducer,
  kbReducer:kbReducer,
  notificationReducer:notificationReducer,
  botReducer:botReducer,
  salesforce: salesforceReducer,
  slack: slackReducer,
  resetPasswordReducer: resetPasswordReducer,

    // other reducers go here
});
export default rootReducer;