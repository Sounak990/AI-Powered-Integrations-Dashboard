import * as actionTypes from './actionTypes';

export const connectWebSocket = (params) => {
  return {
    type: actionTypes.CONNECT_WEBSOCKET,
    payload: params,
  };
};

export const disconnectWebSocket = () => ({
  type: actionTypes.DISCONNECT_WEBSOCKET,
});

export const websocketConnected = () => ({
  type: actionTypes.WEBSOCKET_CONNECTED,
});

export const websocketDisconnected = () => ({
  type: actionTypes.WEBSOCKET_DISCONNECTED,
});

export const websocketError = (error) => ({
  type: actionTypes.WEBSOCKET_ERROR,
  payload: error,
});

export const startRecording = () => ({
  type: actionTypes.START_RECORDING,
});

export const stopRecording = () => ({
  type: actionTypes.STOP_RECORDING,
});

export const audioDataAvailable = (audioBlob) => {
  return {
    type: actionTypes.AUDIO_DATA_AVAILABLE,
    payload: audioBlob,
  };
};

export const exitConversation = () => ({
  type: actionTypes.EXIT_CONVERSATION,
});

export const sendAudioData = (audioData) => {
  return {
    type: actionTypes.SEND_AUDIO_DATA,
    payload: audioData,
  };
};

export const resetAudioData = () => ({
  type: actionTypes.RESET_AUDIO_DATA,
});

export const serverConfirmedExit = () => ({
  type: actionTypes.SERVER_CONFIRMED_EXIT,
});

export const websocketShouldClose = () => ({
  type: actionTypes.WEBSOCKET_SHOULD_CLOSE,
});

export const sendTranscriptData = (transcript) => {
  return {
    type: actionTypes.SEND_TRANSCRIPT_DATA,
    payload: transcript,
  };
};

export const sendAudioBlob = (audioBlob) => ({
  type: actionTypes.SEND_AUDIO_BLOB,
  payload: audioBlob,
});
