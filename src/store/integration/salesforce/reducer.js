import {
  CONNECT_SALESFORCE_SUCCESS,
  CONNECT_SALESFORCE_FAILURE,
  INITIALIZE_SALESFORCE,
  DISCONNECT_SALESFORCE_SUCCESS,
  DISCONNECT_SALESFORCE_FAILURE
} from "./actionTypes";

const initialState = {
  connected: false,
  loading: false,
  error: null,
  integrationId: null,
  connectionId: null,
};

export const salesforceReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONNECT_SALESFORCE_SUCCESS:
      return {
        ...state,
        connected: true,
        loading: false,
        error: null,
        integrationId: action.payload.integrationId,
        connectionId: action.payload.connectionId
      };
    case CONNECT_SALESFORCE_FAILURE:
      return {
        ...state,
        connected: false,
        loading: false,
        error: action.payload.error,
        integrationId: null,
        connectionId: null
      };
    case INITIALIZE_SALESFORCE:
      return {
        ...state,
        loading: false,
        error: null
      };
    case DISCONNECT_SALESFORCE_SUCCESS:
      return {
        ...state,
        connected: false,
        loading: false,
        error: null,
        integrationId: null,
        connectionId: null
      };
    case DISCONNECT_SALESFORCE_FAILURE:
      return {
        ...state,
        connected: true,
        loading: false,
        error: action.payload.error
      };
    default:
      return state;
  }
};