import * as actionTypes from './actionTypes';

export const submitOnboardingForm = (formData, navigate) => ({
  type: actionTypes.SUBMIT_ONBOARDING_FORM,
  payload: { ...formData, navigate },
});

export const onboardingFormSuccess = (data) => ({
  type: actionTypes.ONBOARDING_FORM_SUCCESS,
  payload: data,
});

export const onboardingFormFailure = (error) => ({
  type: actionTypes.ONBOARDING_FORM_FAILURE,
  payload: error,
});

export const resetOnboardingForm = () => ({
  type: actionTypes.RESET_ONBOARDING_FORM,
});
