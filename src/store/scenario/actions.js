import * as actionTypes from './actionTypes';

export const fetchSalesScenarioRequest = () => ({
  type: actionTypes.FETCH_SALES_SCENARIO_REQUEST,
});

export const fetchSalesScenarioSuccess = (data) => ({
  type: actionTypes.FETCH_SALES_SCENARIO_SUCCESS,
  payload: data,
});

export const fetchSalesScenarioFailure = (error) => ({
  type: actionTypes.FETCH_SALES_SCENARIO_FAILURE,
  payload: error,
});
