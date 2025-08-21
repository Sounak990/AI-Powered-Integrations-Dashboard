import {
  CONNECT_SALESFORCE_SUCCESS,
  CONNECT_SALESFORCE_FAILURE,
  INITIALIZE_SALESFORCE,
  DISCONNECT_SALESFORCE_SUCCESS,
  DISCONNECT_SALESFORCE_FAILURE,
} from "./actionTypes";

export const connectSalesforceSuccess = (integrationId, connectionId) => ({
  type: CONNECT_SALESFORCE_SUCCESS,
  payload: { integrationId, connectionId }
});

export const connectSalesforceFailure = (error) => ({
  type: CONNECT_SALESFORCE_FAILURE,
  payload: { error }
});

export const initializeSalesforce = () => ({
  type: INITIALIZE_SALESFORCE
});

export const disconnectSalesforceSuccess = () => ({
  type: DISCONNECT_SALESFORCE_SUCCESS
});

export const disconnectSalesforceFailure = (error) => ({
  type: DISCONNECT_SALESFORCE_FAILURE,
  payload: { error }
});