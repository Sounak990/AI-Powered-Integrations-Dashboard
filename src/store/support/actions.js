import * as actionTypes from './actionTypes';

export const submitSupportForm = (formData) => ({
  type: actionTypes.SUBMIT_SUPPORT_FORM,
  payload: formData,
});

export const supportFormSuccess = (message) => ({
  type: actionTypes.SUPPORT_FORM_SUCCESS,
  payload: message,
});

export const supportFormFailure = (error) => ({
  type: actionTypes.SUPPORT_FORM_FAILURE,
  payload: error,
});
