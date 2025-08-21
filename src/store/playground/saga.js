import { call, put, take, takeLatest, cancelled, fork, delay, cancel, race } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as actionTypes from './actionTypes';
import { 
  websocketConnectedPlayground, 
  websocketDisconnectedPlayground, 
  websocketErrorPlayground, 
  audioDataAvailablePlayground ,
  serverConfirmedExitPlayground,
  websocketShouldClosePlayground
} from './actions';

let mediaRecorder = null; // Define mediaRecorder in a wider scope
let webSocket = null; // Define webSocket in a wider scope for reuse
let intentionalDisconnect = false;

function createWebSocketChannel(params) {
  const { sessionId } = params;
  console.log('[Saga - createWebSocketChannel] Creating WebSocket Channel with params:', params);

  return eventChannel(emitter => {
    const websocketURL = `wss://api.dev.maraca.io/wss/playground`;
    console.log('[Saga - createWebSocketChannel] Connecting to WebSocket URL:', websocketURL);

    webSocket = new WebSocket(websocketURL);

    webSocket.onopen = () => {
      console.log('[Saga - createWebSocketChannel] WebSocket Opened. State:', webSocket.readyState);
      // Ensure that 'params' contains the payload to be sent
      const payloadToSend = params.payload ? JSON.stringify(params.payload) : '{}';
      webSocket.send(payloadToSend);
      emitter(websocketConnectedPlayground());
    };

    webSocket.onclose = (event) => {
      console.log('[Saga - createWebSocketChannel] WebSocket Closing - Intentional Disconnect:', intentionalDisconnect, ', Event Reason:', event.reason);
      if (!intentionalDisconnect) {
        emitter(websocketDisconnectedPlayground());
      } else {
        console.log('[Saga - createWebSocketChannel] WebSocket Closed Intentionally');
      }
    };

    webSocket.onerror = (error) => {
      console.log('[Saga - createWebSocketChannel] WebSocket Error:', error);
      emitter(websocketErrorPlayground(error));
    };

    webSocket.onmessage = (event) => {
      console.log('[Saga - createWebSocketChannel] WebSocket Message Received:', event.data);

      const data = JSON.parse(event.data);

      if (data.type === 'server_confirmed_exit') {
        console.log('[Saga - createWebSocketChannel] Server Confirmed Exit Message Received');
        console.log('[Saga - createWebSocketChannel] DATA', data);
        emitter(serverConfirmedExitPlayground(data.gradedResponse)); // Pass the graded response to the action

      } else if (data.type === 'audio_ready' && data.audioData) {
        const audioBlob = base64ToBlob(data.audioData, 'audio/mp3');
        console.log('[Saga - createWebSocketChannel] Audio Data Available, Blob Size:', audioBlob.size);
        emitter(audioDataAvailablePlayground(audioBlob));
      }
    };

    return () => {
      console.log('[Saga - createWebSocketChannel] Closing WebSocket');
      webSocket.close();
    };
  });
}


function* watchWebSocket(params) {
  const channel = yield call(createWebSocketChannel, params);
  try {
    while (true) {
      const action = yield take(channel);
      yield put(action);
    }
  } finally {
    if (yield cancelled()) {
      channel.close();
    }
  }
}

function* handleExitConversation() {
  console.log('[Saga - handleExitConversation] WebSocket State:', webSocket ? webSocket.readyState : 'undefined');
  if (webSocket && webSocket.readyState === WebSocket.OPEN) {
    console.log('[Saga - handleExitConversation] Sending exit conversation signal');
    webSocket.send(JSON.stringify({ action: 'grade_and_exit_conversation' }));

    console.log('[Saga - handleExitConversation] Waiting for server response or timeout');
    const { serverResponse } = yield race({
      serverResponse: take(actionTypes.SERVER_CONFIRMED_EXIT_PLAYGROUND),
      timeout: delay(25000)
    });

    console.log('[Saga - handleExitConversation] Race condition result:', { serverResponse });
    if (serverResponse) {
      console.log('[Saga - handleExitConversation] Exit confirmation received from the server');
      yield put(websocketShouldClosePlayground());
    } else {
      console.log('[Saga - handleExitConversation] No exit confirmation received, keeping WebSocket open');
    }
  } else {
    console.log('[Saga - handleExitConversation] WebSocket is not open or undefined');
  }
}


function* handleConnectWebSocket(action) {
  console.log('[Saga - handleConnectWebSocket] Connecting WebSocket, Action Payload:', action.payload);
  const task = yield fork(watchWebSocket, action.payload);

  console.log('[Saga - handleConnectWebSocket] Waiting for WEBSOCKET_SHOULD_CLOSE action');
  yield take(actionTypes.WEBSOCKET_SHOULD_CLOSE_PLAYGROUND);

  console.log('[Saga - handleConnectWebSocket] WEBSOCKET_SHOULD_CLOSE action received');
  if (webSocket && webSocket.readyState === WebSocket.OPEN) {
    console.log('[Saga - handleConnectWebSocket] WebSocket is open, now closing');
    intentionalDisconnect = true;
    webSocket.close();
  } else {
    console.log('[Saga - handleConnectWebSocket] WebSocket is not open or undefined at the time of closing');
  }

  yield cancel(task);
  console.log('[Saga - handleConnectWebSocket] WebSocket watch task cancelled');
}

function* handleDisconnectWebSocket() {
  console.log('[Saga - handleDisconnectWebSocket] Disconnecting WebSocket');
  if (webSocket && webSocket.readyState === WebSocket.OPEN) {
    intentionalDisconnect = true; // Indicate that the disconnection is intentional
    webSocket.close(); // Close the WebSocket connection
    console.log('[Saga - handleDisconnectWebSocket] WebSocket closed');
  }
}

function* handleStartRecording() {
  try {
    console.log('[Saga] Starting Recording...');
    const stream = yield call([navigator.mediaDevices, 'getUserMedia'], { audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
  } catch (error) {
    console.error('Error accessing the microphone:', error);
  }
}

function* handleStopRecording() {
  console.log('[Saga] Stopping Recording...');
  if (mediaRecorder) {
    if (mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    mediaRecorder = null; // Reset the reference
  }
}


function* handleSendTranscriptData(action) {
  try {
    console.log('[Saga] Sending Transcript Data... Payload:', action.payload);
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      const message = {
        type: 'transcript',
        data: action.payload
      };
      webSocket.send(JSON.stringify(message));
      console.log('Transcript data sent. WebSocket State:', webSocket.readyState);
    } else {
      console.error('WebSocket is not connected. State:', webSocket ? webSocket.readyState : 'undefined');
    }
  } catch (error) {
    console.error('Error sending transcript data:', error);
  }
}

function base64ToBlob(base64, contentType) {
    console.log('[base64ToBlob] Starting conversion with contentType:', contentType);

    try {
        const byteCharacters = atob(base64);
        console.log('[base64ToBlob] Length of decoded base64:', byteCharacters.length);

        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        console.log('[base64ToBlob] Blob created with size:', blob.size);
        return blob;

    } catch (error) {
        console.error('[base64ToBlob] Error in conversion:', error);
        return null; // Return null if conversion fails
    }
}

export default function* conversationSaga() {
  yield takeLatest(actionTypes.CONNECT_WEBSOCKET_PLAYGROUND, handleConnectWebSocket);
  yield takeLatest(actionTypes.START_RECORDING_PLAYGROUND, handleStartRecording);
  yield takeLatest(actionTypes.STOP_RECORDING_PLAYGROUND, handleStopRecording);
  yield takeLatest(actionTypes.EXIT_CONVERSATION_PLAYGROUND, handleExitConversation);
  yield takeLatest(actionTypes.DISCONNECT_WEBSOCKET_PLAYGROUND, handleDisconnectWebSocket);
  yield takeLatest(actionTypes.SEND_TRANSCRIPT_DATA_PLAYGROUND, handleSendTranscriptData);
}
