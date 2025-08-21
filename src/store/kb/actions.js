import { FETCH_KB_REQUEST, FETCH_KB_SUCCESS, FETCH_KB_FAILURE } from './actionTypes'

export const fetchKBRequest = (tenantId) => ({
  type: FETCH_KB_REQUEST,
  payload: { tenantId }
});

export const fetchKBSuccess = (data) => ({
  type: FETCH_KB_SUCCESS,
  payload: { data }
});

export const fetchKBFailure = (error) => ({
  type: FETCH_KB_FAILURE,
  payload: { error }
});
