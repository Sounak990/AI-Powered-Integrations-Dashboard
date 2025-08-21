import * as actionTypes from './actionTypes';

const initialState = {
  isConnected: false,
  isRecording: false,
  audioBlob: null,
  error: null,
  messages: [],
  websocketClosed: false,
};

const conversationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CONNECT_WEBSOCKET:
      return { ...state, isConnected: true, error: null };
    case actionTypes.WEBSOCKET_DISCONNECTED:
      return { ...state, isConnected: false };
    case actionTypes.DISCONNECT_WEBSOCKET:
      return { ...state, isConnected: false };
    case actionTypes.WEBSOCKET_ERROR:
      return { ...state, error: action.payload };
    case actionTypes.START_RECORDING:
      return { ...state, isRecording: true };
    case actionTypes.STOP_RECORDING:
      return { ...state, isRecording: false };
    case actionTypes.AUDIO_DATA_AVAILABLE:
      return { ...state, audioBlob: action.payload };
    case actionTypes.MESSAGE_RECEIVED:
      return { ...state, messages: [...state.messages, action.payload] };
    case actionTypes.RESET_AUDIO_DATA:
      return { ...state, audioBlob: null };
    case actionTypes.WEBSOCKET_DISCONNECTED:
      return { ...state, initialState };
    case actionTypes.WEBSOCKET_SHOULD_CLOSE:
      return {
        ...state,
        websocketClosed: true,
      };
    case actionTypes.SERVER_CONFIRMED_EXIT:
      return {
        ...state,
        isConnected: false
      };
    case actionTypes.SEND_AUDIO_BLOB:
      return {
          ...state,
          audioBlob: action.payload,
      };
    // Other cases as needed
    default:
      return state;
  }
};

export default conversationReducer;
