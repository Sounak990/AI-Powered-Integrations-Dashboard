// onboardingReducer.js
import * as actionTypes from './actionTypes';

const initialState = {
  loading: false,
  data: null,
  error: null,
  isSuccess: false,
  isError: false,
};

const onboardingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SUBMIT_ONBOARDING_FORM:
      return { ...state, loading: true, error: null, isSuccess: false, isError: false };
    case actionTypes.ONBOARDING_FORM_SUCCESS:
      return { ...state, loading: false, data: action.payload, isSuccess: true, isError: false };
    case actionTypes.ONBOARDING_FORM_FAILURE:
      return { ...state, loading: false, error: action.payload, isSuccess: false, isError: true };
    case actionTypes.RESET_ONBOARDING_FORM:
      return { ...initialState }; // Reset to initial state
    default:
      return state;
  }
};

export default onboardingReducer;
