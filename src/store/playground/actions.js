import * as actionTypes from './actionTypes';

export const connectWebSocketPlayground = (params) => {
  console.log('[connectWebSocketPlayground] called with params:', params);
  return {
    type: actionTypes.CONNECT_WEBSOCKET_PLAYGROUND,
    payload: params,
  };
};

export const disconnectWebSocketPlayground = () => {
  console.log('[disconnectWebSocketPlayground] called');
  return {
    type: actionTypes.DISCONNECT_WEBSOCKET_PLAYGROUND,
  };
};

export const websocketConnectedPlayground = () => {
  console.log('[websocketConnectedPlayground] called');
  return {
    type: actionTypes.WEBSOCKET_CONNECTED_PLAYGROUND,
  };
};

export const websocketDisconnectedPlayground = () => {
  console.log('[websocketDisconnectedPlayground] called');
  return {
    type: actionTypes.WEBSOCKET_DISCONNECTED_PLAYGROUND,
  };
};

export const websocketErrorPlayground = (error) => {
  console.log('[websocketErrorPlayground] called with error:', error);
  return {
    type: actionTypes.WEBSOCKET_ERROR_PLAYGROUND,
    payload: error,
  };
};

export const startRecordingPlayground = () => {
  console.log('[startRecordingPlayground] called');
  return {
    type: actionTypes.START_RECORDING_PLAYGROUND,
  };
};

export const stopRecordingPlayground = () => {
  console.log('[stopRecordingPlayground] called');
  return {
    type: actionTypes.STOP_RECORDING_PLAYGROUND,
  };
};

export const audioDataAvailablePlayground = (audioBlob) => {
  // Basic log to confirm the function call and log the blob
  console.log('[audioDataAvailablePlayground] called with audioData:', audioBlob);

  // Log the action type
  console.log('[audioDataAvailablePlayground] action type:', actionTypes.AUDIO_DATA_AVAILABLE_PLAYGROUND);

  // Log more details about the audioBlob
  if (audioBlob) {
    console.log('[audioDataAvailablePlayground] audioBlob size:', audioBlob.size);
    console.log('[audioDataAvailablePlayground] audioBlob type:', audioBlob.type);
  } else {
    console.warn('[audioDataAvailablePlayground] Warning: audioBlob is', audioBlob);
  }

  // Create the action object
  const action = {
    type: actionTypes.AUDIO_DATA_AVAILABLE_PLAYGROUND,
    payload: audioBlob,
  };

  // Log the entire action object
  console.log('[audioDataAvailablePlayground] action:', action);

  // Start performance timer (to be ended in the reducer)
  console.time('[audioDataAvailablePlayground] action processing time');

  // Return the action object
  return action;
};

export const exitConversationPlayground = () => {
  console.log('[exitConversationPlayground] called');
  return {
    type: actionTypes.EXIT_CONVERSATION_PLAYGROUND,
  };
};

export const sendAudioDataPlayground = (audioData) => {
  console.log('[sendAudioDataPlayground] called with audioData:', audioData);
  return {
    type: actionTypes.SEND_AUDIO_DATA_PLAYGROUND,
    payload: audioData,
  };
};

export const resetAudioDataPlayground = () => {
  console.log('[resetAudioDataPlayground] called');
  return {
    type: actionTypes.RESET_AUDIO_DATA_PLAYGROUND,
  };
};

export const serverConfirmedExitPlayground = (gradedResponse) => {
  return {
      type: actionTypes.SERVER_CONFIRMED_EXIT_PLAYGROUND,
      payload: gradedResponse,
  };
};

export const websocketShouldClosePlayground = () => {
  console.log('[websocketShouldClosePlayground] called');
  return {
    type: actionTypes.WEBSOCKET_SHOULD_CLOSE_PLAYGROUND,
  };
};

export const sendTranscriptDataPlayground = (transcript) => {
  console.log('[sendTranscriptDataPlayground] called with transcript:', transcript);
  return {
    type: actionTypes.SEND_TRANSCRIPT_DATA_PLAYGROUND,
    payload: transcript,
  };
};

export const startGradingPlayground = () => ({
  type: actionTypes.START_GRADING_PLAYGROUND,
});

export const stopGradingPlayground = () => ({
  type: actionTypes.STOP_GRADING_PLAYGROUND,
});

export const setCustomerPersonaDataPlayground = (data) => {
  return {
      type: actionTypes.SET_CUSTOMER_PERSONA_DATA_PLAYGROUND,
      payload: data,
  };
};

export const resetCustomerPersonaDataPlayground = () => ({
  type: actionTypes.RESET_CUSTOMER_PERSONA_DATA_PLAYGROUND,
});