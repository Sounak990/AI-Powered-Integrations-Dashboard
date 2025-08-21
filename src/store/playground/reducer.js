import * as actionTypes from './actionTypes';

const initialState = {
  isConnected: false,
  isRecording: false,
  audioBlob: null,
  error: null,
  messages: [],
  websocketClosed: false,
  isGradingInProgress: false,
  gradedResponse: null,
  customerPersonaData: {},
};

const conversationPlaygroundReducer = (state = initialState, action) => {
  console.log('[conversationPlaygroundReducer] action received:', action.type, action.payload);

  switch (action.type) {
    case actionTypes.CONNECT_WEBSOCKET_PLAYGROUND:
      console.log('[CONNECT_WEBSOCKET_PLAYGROUND] called');
      return { ...state, isConnected: true, error: null };
    case actionTypes.WEBSOCKET_CONNECTED_PLAYGROUND:
        return { ...state, isConnected: true, error: null };
    case actionTypes.WEBSOCKET_DISCONNECTED_PLAYGROUND:
      console.log('[WEBSOCKET_DISCONNECTED_PLAYGROUND] called');
      return { ...state, isConnected: false };
    case actionTypes.DISCONNECT_WEBSOCKET_PLAYGROUND:
      console.log('[DISCONNECT_WEBSOCKET_PLAYGROUND] called');
      return { ...state, isConnected: false };
    case actionTypes.WEBSOCKET_ERROR_PLAYGROUND:
      console.log('[WEBSOCKET_ERROR_PLAYGROUND] called with error:', action.payload);
      return { ...state, error: action.payload };
    case actionTypes.START_RECORDING_PLAYGROUND:
      console.log('[START_RECORDING_PLAYGROUND] called');
      return { ...state, isRecording: true };
    case actionTypes.STOP_RECORDING_PLAYGROUND:
      console.log('[STOP_RECORDING_PLAYGROUND] called');
      return { ...state, isRecording: false };
    case actionTypes.AUDIO_DATA_AVAILABLE_PLAYGROUND:
      console.timeEnd('[audioDataAvailablePlayground] action processing time');
      console.log('[AUDIO_DATA_AVAILABLE_PLAYGROUND] called with audioBlob:', action.payload);
      return { ...state, audioBlob: action.payload };
    case actionTypes.MESSAGE_RECEIVED_PLAYGROUND:
      console.log('[MESSAGE_RECEIVED_PLAYGROUND] called with message:', action.payload);
      return { ...state, messages: [...state.messages, action.payload] };
    case actionTypes.RESET_AUDIO_DATA_PLAYGROUND:
      console.log('[RESET_AUDIO_DATA_PLAYGROUND] called');
      return { ...state, audioBlob: null };
    case actionTypes.WEBSOCKET_SHOULD_CLOSE_PLAYGROUND:
      console.log('[WEBSOCKET_SHOULD_CLOSE_PLAYGROUND] called');
      return {
        ...state,
        websocketClosed: true,
      };
    case actionTypes.SET_CUSTOMER_PERSONA_DATA_PLAYGROUND:
      return {
          ...state,
          customerPersonaData: action.payload,
      };
    case actionTypes.SERVER_CONFIRMED_EXIT_PLAYGROUND:
      console.log('[SERVER_CONFIRMED_EXIT_PLAYGROUND] called');
      return {
        ...state,
        isConnected: false,
        gradedResponse: action.payload,
      };
    case actionTypes.START_GRADING_PLAYGROUND:
        return { ...state, isGradingInProgress: true };
    case actionTypes.STOP_GRADING_PLAYGROUND:
        return { ...state, isGradingInProgress: false };
      case actionTypes.RESET_CUSTOMER_PERSONA_DATA_PLAYGROUND:
        return { ...state, customerPersonaData: {}};
    // Other cases as needed
    default:
      return state;
  }
};

export default conversationPlaygroundReducer;
