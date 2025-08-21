import { call, put, take, select, delay, fork, cancel } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import { addNotification } from './actions';
import config from "@/config";

// Function to create the event channel for SSE
function createEventSourceChannel(url, tenantId, username) {
	console.log(`Creating EventSource for URL: ${url}?tenant_id=${tenantId}&username=${username}`);

	return eventChannel((emitter) => {
		const eventSource = new EventSource(`${url}?tenant_id=${tenantId}&username=${username}`);

		eventSource.onopen = () => {
			console.log("SSE connection opened");
			emitter({ type: 'open' });
		};

		eventSource.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				console.log("SSE message received:", data);
				emitter(data);  // Send the message data to the channel
			} catch (error) {
				console.error('Error parsing SSE message:', error);
				emitter(new Error(error));
			}
		};

		eventSource.onerror = (error) => {
			console.error('SSE error:', error);
			emitter(new Error(error));
		};

		eventSource.onclose = () => {
			console.log("SSE connection closed by server or client");
			emitter(END);  // Use END to signal channel closure
		};

		return () => {
			console.log("Cleaning up the event source");
			eventSource.close();
		};
	});
}

// Simplified retry mechanism
function* watchSSE() {
	const url = `${config.api.BASE_URL}/sse/notifications`;
	let retries = 5;

	while (retries > 0) {
		console.log(`Attempt to start SSE. Retries left: ${retries}`);

		// Log to trace the selection process
		console.log("Selecting tenantId and username from the state");
		const tenantId = yield select(state => state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id);
		const username = yield select(state => state.login.user?.username);

		// Log the selected values
		console.log(`Selected tenantId: ${tenantId}, username: ${username}`);

		if (tenantId && username) {
			console.log(`Starting SSE with tenantId: ${tenantId} and username: ${username}`);
			const eventSourceChannel = yield call(createEventSourceChannel, url, tenantId, username);

			try {
				while (true) {
					console.log("Waiting for SSE message...");
					const message = yield take(eventSourceChannel);
					console.log("Received from eventSourceChannel:", message);

					if (message instanceof Error) {
						console.error("Error received in SSE:", message);
						yield put(addNotification({ type: 'error', message: 'SSE connection error' }));
						break; // Exit the loop to handle reconnection or cleanup
					} else if (message.type === 'open') {
						console.log("SSE connection successfully opened.");
					} else {
						// Dispatch the message (either single or batch) directly
						console.log("Dispatching notification:", message);
						yield put(addNotification(message));
					}
				}
			}
			catch (error) {
				console.error("Error in watchSSE:", error);
			}
			finally {
				console.log("SSE channel closed");
				eventSourceChannel.close();
			}
			break; // Successful connection established, exit retry loop
		}

		console.warn(`Retrying to get tenantId and username. Attempts left: ${retries - 1}`);
		retries -= 1;
		yield delay(1000);
	}

	if (retries === 0) {
		console.error("Failed to start SSE after retries. Tenant ID or Username is missing.");
	}
}

export default watchSSE;