import axios from 'axios';
import Nango from '@nangohq/frontend';
import config from '@/config';

// Base URL for your API
const API_BASE_URL = config.api.BASE_URL; // Replace with your API base URL

const LOGIN_ENDPOINT = '/api/auth/login';
const REGISTER_ENDPOINT = '/api/auth/register';
const VERIFY_EMAIL_ENDPOINT = '/api/verification/verify-email';
const RESET_PASSWORD_REQUEST = '/api/auth/password-reset-request';
const ONBOARDING_ENDPOINT = '/api/onboarding';
const AUDIO_SUBMISSION_ENDPOINT = '/api/stream/speak'

// Axios instance
const apiInstance = axios.create({
	baseURL: API_BASE_URL,
	// You can set more default headers if needed
});

// Add a request interceptor
apiInstance.interceptors.request.use(
	function (config) {
		// Retrieve authUser data from localStorage
		const authUser = localStorage.getItem('authUser');
		if (authUser) {
			const userData = JSON.parse(authUser);
			// Assuming your token is stored under userData.token
			config.headers.Authorization = `Bearer ${userData.access_token}`;
		}
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

// Login API call
export const apiLogin = async (credentials) => {
	console.log('Login Details: ', credentials);
	try {
		const response = await apiInstance.post(LOGIN_ENDPOINT, credentials);
		console.log('LOGIN RESPONSE: ', response.data)
		const userData = response.data;
		// userData.expires_at = new Date().getTime() + (30 * 60) * 1000;
		// localStorage.setItem('authUser', JSON.stringify(userData));
		return userData;
	} catch (error) {
		throw error;
	}
};

export const apiChangePassword = async (username, tenantId, currentPassword, newPassword) => {
	console.log('Change Password Request: ', { username, tenantId, currentPassword, newPassword });
	try {
		const response = await apiInstance.post('/auth/change-password', {
			username,
			tenantId,
			currentPassword,
			newPassword
		});
		console.log('CHANGE PASSWORD RESPONSE: ', response.data);
		return response.data;
	} catch (error) {
		throw error;
	}
};



// Registration API call
export const apiRegister = (user) => {
	console.log("Sending API register: ", user)
	return apiInstance.post(REGISTER_ENDPOINT, user);
};
// You can export more API calls if needed

// Email Verification API call
export const apiVerifyEmail = (token) => {
	console.log("Sending API request to verify email with token: ", token);
	return apiInstance.post(`${VERIFY_EMAIL_ENDPOINT}?token=${token}`);
};

// Email Verification API call
export const resetPasswordRequest = (email) => {
	console.log("Sending API request to send password reset email to: ", email);
	return apiInstance.post(RESET_PASSWORD_REQUEST, { email: email });
};


export const submitOnboarding = async (tenantName) => {
	// Constructing the JSON object to be sent
	const data = {
		tenant: {
			name: tenantName
		}
	};

	console.log('Sending Tenant Details: ', data);

	try {
		const response = await apiInstance.post(ONBOARDING_ENDPOINT, JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
		console.log("Server response:", response.data);
		return response.data;
	} catch (error) {
		console.error('Error in submitOnboarding:', error);
		// Handle or throw error appropriately
		throw error.response?.data?.message || 'Failed to submit form';
	}
};


export const submitSupportFormApi = async (formData, tenantId, username) => {
	const queryParams = new URLSearchParams({ tenant_id: tenantId, username }).toString(); // Use tenant_id instead of tenantId
	try {
		const response = await apiInstance.post(`/submit-support-form/?${queryParams}`, formData);
		console.log('Support form submission response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error submitting support form:', error);
		throw error;
	}
};

// Replace with actual API endpoint and method
export const fetchSalesScenarioApi = async () => {
	try {
		console.log('Sales CALLL;');
		const response = await apiInstance.get('/sales-scenario'); // Your API endpoint
		console.log('Sales scenario data received:', response.data);
		return response.data; // Directly return the data from the response
	} catch (error) {
		console.error('Error fetching sales scenario:', error.toJSON());
		throw new Error(error.message);
	}
};

export const fetchFeedbackReport = async (username, tenantId) => {
	try {
		const response = await apiInstance.get(`/reports?username=${username}&tenant_id=${tenantId}`);
		console.log('Feedback data received:', response.data);
		return response.data
	} catch (error) {
		console.error('Error fetching feedback:', error);
		throw new Error(error.response?.data?.message || 'Failed to fetch feedback');
	}
};

export const fetchSpecificFeedback = async (username, tenantId, conversationId) => {
	try {
		const response = await apiInstance.get(`/reports/feedback/${tenantId}/${username}/${conversationId}`);
		console.log("RESPONSE", response)
		return response.data
	} catch (error) {
		throw new Error('Error fetching specific feedback:', error);
	}
};

export const fetchUsersByTenant = async (tenantId) => {
	try {

		const response = await apiInstance.get(`/users/list/${tenantId}`);
		console.log("USERS:", response)
		return response.data; // Axios automatically parses the JSON response
	} catch (error) {
		console.error('Error fetching users:', error);
		throw new Error(error.response?.data?.message || 'Failed to fetch users');
	}
};

export const inviteUser = async (email, tenantId, invitedByUserEmail) => {
	try {
		const inviteData = { email, tenant_id: tenantId, invited_by: invitedByUserEmail };
		const response = await apiInstance.post(`/users/invite`, inviteData);
		console.log('User invitation response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error inviting user:', error);
		throw error;
	}
};

// Add this function in your API service file

export const registerInvitedUser = async (registrationData) => {
	try {
		console.log("REGISTRATION:", registrationData)
		const response = await apiInstance.post("/auth/invite-register", registrationData);
		console.log('Registration response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error registering user:', error);
		throw error;
	}
};



export const fetchInactiveUsers = async (tenantId) => {
	try {
		const response = await apiInstance.get(`/users/inactive`, {
			params: { tenant_id: tenantId },
		});
		return response.data; // Always returns a list, could be empty
	} catch (error) {
		throw error; // Handle errors as needed
	}
};

export const verifyToken = async (token) => {
	try {
		console.log("Sending request to verify token");
		const response = await apiInstance.get(`/verification/verify-token`, { params: { token } });
		console.log("Response from verify-token endpoint:", response);
		return response.data.valid;
	} catch (error) {
		console.error('Error verifying token:', error);
		if (error.response) {
			// Log the full response if available
			console.error('Error response:', error.response);
		}
		return false;
	}
};



export const submitScenarioApi = async (scenarioData, tenantId, username) => {
	const queryParams = new URLSearchParams({ tenant_id: tenantId, username }).toString();
	try {
		const response = await apiInstance.post(`/scenario/submit-scenario/?${queryParams}`, scenarioData);

		console.log('Scenario submission response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error submitting scenario:', error);
		throw error;
	}
};

export const fetchScenariosApi = async (tenantId) => {
	try {
		const response = await apiInstance.get(`/scenario/get-all-scenarios/?tenant_id=${tenantId}`);
		console.log('SCENARIO', response.data)
		return response.data
	} catch (error) {
		console.error('Error fetching scenarios:', error);
		throw error;
	}
};


export const fetchScenariosByTenantAndUsernameApi = async (tenantId, username) => {
	try {
		const response = await apiInstance.get(`/scenario/get-user-scenarios/?tenant_id=${tenantId}&username=${username}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching scenarios:', error);
		throw error;
	}
};


export const assignUsersToScenario = async (tenantId, userEmails, scenarioId) => {
	console.log('SCENARIO', scenarioId, 'EMAIL', userEmails, 'TENANT', tenantId)
	try {
		const response = await apiInstance.post("/scenario/assign-users-to-scenario/", {
			tenant_id: tenantId,
			scenario_id: scenarioId,
			user_emails: userEmails
		});

		// Check if the request was successful
		if (response.status === 200) {
			console.log('Assignment response:', response.data);
			return response.data;
		} else {
			// Handle non-200 status codes
			console.error('Error assigning users:', response.statusText);
			throw new Error('Error assigning users');
		}
	} catch (error) {
		console.error('Error assigning users:', error);
		throw error;
	}
};

export const fetchUserScenarios = async (tenantId, username) => {
	try {
		console.log(`Fetching scenarios for tenantId=${tenantId}, username=${username}`);
		const response = await apiInstance.get(`/scenario/get-user-scenarios/?tenant_id=${tenantId}&username=${username}`);
		console.log('API Response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error fetching scenarios:', error);
		throw error;
	}
};

export const fetchUserCumulativeGrades = async (tenantId, username) => {
	try {
		console.log(`Fetching scenarios for tenantId=${tenantId}, username=${username}`);
		const response = await apiInstance.get(`/reports/cumulate-grades/${tenantId}/${username}`);
		console.log('API Response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error fetching scenarios:', error);
		// Rethrow the error if needed or handle it accordingly
		throw error;
	}
};

// get chats
export const getChats = () => get(url.GET_CHATS);

// get groups
export const getGroups = () => get(url.GET_GROUPS);

// get Contacts
export const getContacts = () => get(url.GET_CONTACTS);

// get messages
export const getMessages = (roomId = "") =>
	get(`${url.GET_MESSAGES}/${roomId}`, { params: { roomId } });


// get messages
// post messages
export const addMessage = message => post(url.ADD_MESSAGE, message);


export const submitAudioData = async (audioBlob) => {
	const formData = new FormData();
	formData.append('audio_file', audioBlob, 'audio.wav');

	console.log('Submitting audio data');

	try {
		const response = await apiInstance.post(AUDIO_SUBMISSION_ENDPOINT, formData);
		console.log("Audio submission response:", response.data);
		return response.data;
	} catch (error) {
		console.error('Error in submitAudioData:', error);
		throw new Error(error.response?.data?.message || 'Failed to submit audio data');
	}
};

export const fetchUserConversations = async (tenantId, username) => {
	try {
		console.log(`Fetching conversations for tenantId=${tenantId}, username=${username}`);
		const response = await apiInstance.get(`/conversations?tenant_id=${tenantId}&username=${username}`);
		console.log('API Response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error fetching conversations:', error);
		throw error; // Re-throw the error to handle it in the calling component
	}
};

export const fetchRoleplayConversations = async (tenantId, username) => {
	try {
		console.log(`Fetching roleplay conversations for tenantId=${tenantId}, username=${username}`);
		const response = await apiInstance.get(`/roleplay-conversations?tenant_id=${tenantId}&username=${username}`);
		console.log('Roleplay API Response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error fetching roleplay conversations:', error);
		throw error;
	}
};



export const submitBotData = async (botData, tenantId, username) => {
	try {
		const response = await apiInstance.post('/bot/save-bot', {
			...botData,
			tenant_id: tenantId,
			username: username
		});

		return response.data;
	} catch (error) {
		console.error('Error submitting bot data:', error);
		throw error; // Rethrow the error to allow the caller to handle it
	}
};


export const updateBotData = async (botData) => {
	const response = await apiInstance.put(`/bot/update-bot/${botData.bot_id}`, {
		...botData,
		tenant_id: botData.tenantId,  // Rename tenantId to tenant_id
		username: botData.username    // Ensure username is correctly included
	});
	return response.data;
};


export const fetchUserBotData = async (tenantId, username) => {
	try {
		console.log(`Fetching bot data for tenantId=${tenantId}, username=${username}`);
		const response = await apiInstance.get(`/bot/get-bots?tenant_id=${tenantId}&username=${username}`);
		console.log('Bot Response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error fetching bot data:', error);
		throw error; // Re-throw the error to handle it in the calling component
	}
};

export const deleteBotData = async (bot_id, tenant_id, username) => {
	try {
		const response = await apiInstance.delete(`/bot/delete-bot/${bot_id}`, {
			headers: {
				'Content-Type': 'application/json',
				'tenant-id': tenant_id,
				'username': username
			}
		});
		return response.data; // Assuming response.data contains the result of the deletion
	} catch (error) {
		console.error('Error deleting bot data:', error);
		throw error;
	}
};

export const submitAssignmentApi = async (assignmentData) => {
	try {
		const response = await apiInstance.post(`/assignment/submit-assignment`, assignmentData);
		console.log('Assignment submission response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error submitting assignment:', error);
		throw error;
	}
};

export const fetchAssignmentsByTenant = async (tenantId) => {
	try {
		const response = await apiInstance.get(`/assignment/${tenantId}`);
		console.log('Assignments fetched:', response.data);
		return response.data.assignments;
	} catch (error) {
		console.error('Error fetching assignments:', error);
		throw error;
	}
};


// Function to upload roleplay files
export const uploadRoleplayFile = async (file, tenantId, username) => {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('type', 'roleplay');
	formData.append('tenant_id', tenantId);
	formData.append('username', username);

	try {
		const response = await apiInstance.post('/kb/file/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
		return response.data;
	} catch (error) {
		console.error('Error uploading roleplay file:', error);
		throw error;
	}
};

// Function to upload grading files
export const uploadGradingFile = async (file, tenantId, username) => {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('type', 'grading');
	formData.append('tenant_id', tenantId);
	formData.append('username', username);

	try {
		const response = await apiInstance.post('/kb/file/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
		return response.data;
	} catch (error) {
		console.error('Error uploading grading file:', error);
		throw error;
	}
};

export const fetchKBByTenant = async (tenantId) => {
	try {
		const response = await apiInstance.get(`/kb/get-files/${tenantId}`);
		console.log('KB fetched:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error fetching assignments:', error);
		throw error;
	}
};

export const sendPersona = async (persona) => {
	try {
		const response = await apiInstance.post('/kb/submit-persona', persona);
		return response.data;
	} catch (error) {
		console.error('Error sending persona to backend:', error);
		return null;
	}
};

export const updatePersona = async (tenantId, personaName, persona) => {
	try {
		const response = await axios.put(`${API_BASE_URL}/kb/update-persona/${tenantId}/${personaName}`, persona);
		return response.data;
	} catch (error) {
		console.error('Error updating persona:', error);
		throw error;
	}
};


export const fetchPersonasByTenant = async (tenantId) => {
	try {
		const response = await apiInstance.get(`/kb/get-persona/${tenantId}`);
		console.log('Persona', response.data)
		return response.data;

	} catch (error) {
		console.error('Error fetching personas:', error);
		return null;
	}
};

export const updateAssignmentApi = async (assignmentData, tenantId, username) => {
	try {
		// Add tenantId and username to the payload
		const payload = {
			...assignmentData,
			tenant_id: tenantId,
			username: username,
		};

		// Send PUT request to update the assignment
		const response = await apiInstance.put(`/assignment/edit-assignment/${assignmentData.assignment_id}`, payload);

		// Return the updated assignment data from the response
		return response.data;
	} catch (error) {
		console.error('Error updating assignment:', error);
		throw error; // Re-throw the error so it can be handled by the caller
	}
};

// Function to send roleplay_id and tenant_id to the backend
export const sendRoleplayCompleteStatus = async (roleplayId, tenantId, username) => {
	try {
		const response = await apiInstance.post(`/roleplay/roleplay-end`, {
			roleplay_id: roleplayId,
			tenant_id: tenantId,
			username: username
		});
		return response.data;
	} catch (error) {
		console.error('Error sending roleplay data:', error);
		throw error;
	}
};

export const fetchRoleplayMetrics = async (tenantId, assignmentId) => {
	try {
		const response = await apiInstance.post('/metrics/roleplay-metrics', {
			tenant_id: tenantId,
			assignment_id: assignmentId,
		});
		console.log('Metrics', response.data)

		return response.data;
	} catch (error) {
		console.error('Error fetching roleplay metrics:', error);
		throw error;
	}
};

// Fetch assignment details by tenant ID and assignment ID
export const fetchAssignmentDetails = async (tenantId, assignmentId) => {
	try {
		const response = await apiInstance.get(`/assignment/get-assignment/${assignmentId}`, {
			params: { tenant_id: tenantId }
		});
		return response.data; // Return the response data
	} catch (error) {
		console.error('Error fetching assignment details:', error);
		throw error;
	}
};


export const sendSalesforceCredentials = async (clientId, clientSecret, tenant_id, username) => {
	try {
		const response = await apiInstance.post('/integration/salesforce/auth', {
			clientId,
			clientSecret,
			tenant_id,
			username,
		});

		// Assuming response.data contains the result you expect (e.g., a success message or object)
		return response.data;

	} catch (error) {
		console.error('Error sending Salesforce credentials:', error);
		throw error; // Propagate the error to be handled in the calling function
	}
};

export const slackRefresh = async (tenantId) => {
	try {
		const response = await apiInstance.get(`/slack/refresh?tenant_id=${tenantId}`);
		return response.data;
	} catch (error) {
		console.error('Error refreshing Slack integration:', error);
		throw error;
	}
};

export const nangoService = {
	integrateNango: async (tenantId, clientId, clientSecret, provider, oauthScopes) => {
		try {
			const response = await apiInstance.post('/nango/nango-integrate', {
				tenant_id: tenantId,
				client_id: clientId,
				client_secret: clientSecret,
				provider,
				oauth_scopes: oauthScopes
			});
			return response.data;
		} catch (error) {
			if (error.response && error.response.data && error.response.data.error) {
				throw new Error(error.response.data.error.message || 'An error occurred while integrating with Nango');
			}
			throw new Error('Network error occurred while integrating with Nango');
		}
	},

	performNangoAuth: async (integrationId, sessionToken) => {
		const nango = new Nango({ connectSessionToken: sessionToken });
		try {
			const result = await nango.auth(integrationId);
			return result;
		} catch (error) {
			if (error.message) {
				throw new Error(`Nango authentication failed: ${error.message}`);
			}
			throw new Error('An unknown error occurred during Nango authentication');
		}
	},

	saveNangoIntegration: async (data) => {
		try {
			const response = await apiInstance.post('/nango/nango-connect', data);
			return response.data;
		} catch (error) {
			if (error.response && error.response.data && error.response.data.error) {
				throw new Error(error.response.data.error.message || 'An error occurred while saving Nango integration');
			}
			throw new Error('Network error occurred while saving Nango integration');
		}
	},

	disconnectIntegration: async (integrationId, connectionId) => {
		try {
			const response = await apiInstance.delete(`/nango/nango-disconnect/${integrationId}/${connectionId}`);
			return response.data;
		} catch (error) {
			if (error.response && error.response.data && error.response.data.error) {
				throw new Error(error.response.data.error.message || 'An error occurred while disconnecting the integration');
			}
			throw new Error('Network error occurred while disconnecting the integration');
		}
	},

	refreshNangoIntegration: async (platform, tenant_id) => {
		try {
			const response = await apiInstance.get(`/nango/nango-refresh/${platform}?tenant_id=${tenant_id}`);
			return response.data;
		} catch (error) {
			console.error('Error refreshing Nango integration:', error);
			throw new Error(error.response?.data?.message || 'Failed to refresh Nango integration');
		}
	}
};

export const createIntegrationType1 = async (data) => {
	try {
		const response = await apiInstance.post('/api/integrations/create_integration_type_1', data);
		return response.data;
	} catch (error) {
		console.error('Error creating integration:', error);
		throw error;
	}
}

export const createIntegrationType2 = async (data) => {
	try {
		const response = await apiInstance.post('/api/integrations/create_integration_type_2', data);
		return response.data;
	} catch (error) {
		console.error('Error creating integration:', error);
		throw error;
	}
}

export const fetchIntegrations = async (tenantId) => {
	try {
		const response = await apiInstance.get(`/api/integrations/view_integration/tenant_id?tenant_id=${tenantId}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching integrations:', error);
		throw error;
	}
}

export const refreshIntegration = async (integrationId) => {
	try {
		const response = await apiInstance.post(`/api/integrations/refresh_integration?integration_id=${integrationId}`);
		return response.data;
	} catch (error) {
		console.error('Error refreshing integration:', error);
		throw error;
	}
}

export const syncData = async (integrationId) => {
	try {
		const response = await apiInstance.post(`/api/integrations/sync_data_from_integration?integration_id=${integrationId}`);
		return response.data;
	} catch (error) {
		console.error('Error syncing data:', error);
		throw error;
	}
}

export const createSessionToken = async (integration_id) => {
	try {
		const response = await apiInstance.get(`/api/integrations/create_session_token?integration_id=${integration_id}`);
		return response.data;
	} catch (error) {
		console.error('Error creating session token:', error);
		throw error;
	}
}

export const confirmIntegration = async (data) => {
	try {
		const response = await apiInstance.post('/api/integrations/confirm_integration_type_1', data);
		return response.data;
	} catch (error) {
		console.error('Error confirming integration:', error);
		throw error;
	}
}

export const deleteIntegration = async (tenantId, integrationId) => {
	try {
		const response = await apiInstance.delete(`/api/integrations/delete_integration?tenant_id=${tenantId}&integration_id=${integrationId}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting integration:', error);
		throw error;
	}
}

export const fetchConnections = async (tenantId) => {
	try {
		const response = await apiInstance.get(`/api/connections/get_all_connections?tenant_id=${tenantId}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching connections:', error);
		throw error;
	}
}

export const createConnection = async (data) => {
	try {
		const response = await apiInstance.post('/api/connections/create_connection', data);
		return response.data;
	} catch (error) {
		console.error('Error creating connection:', error);
		throw error;
	}
}

export const deleteConnection = async (tenantId, connectionId) => {
	try {
		const response = await apiInstance.delete(`/api/connections/delete_connection?connection_id=${connectionId}&tenant_id=${tenantId}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting connection:', error);
		throw error;
	}
}

export const createChat = async (connectionId) => {
	try {
		const response = await apiInstance.get(`/api/rag/create_chat?connection_id=${connectionId}`);
		return response.data;
	} catch (error) {
		console.error('Error creating chat:', error);
		throw error;
	}
}

export const getChatHistory = async (tenantId) => {
	try {
		const response = await apiInstance.get(`/api/rag/chat_history?tenant_id=${tenantId}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching chats:', error);
		throw error;
	}
}

export const getChatData = async (chatId) => {
	try {
		const response = await apiInstance.get(`/api/rag/chat/${chatId}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching chat data:', error);
		throw error;
	}
}

export const chatCompletion = async (data) => {
	try {
		const response = await apiInstance.post('/api/rag/chat_completion', data);
		return response.data;
	} catch (error) {
		console.error('Error completing chat:', error);
		throw error;
	}
}

export const checkUniqueIntegrationName = async (integrationName) => {
	try {
		const response = await apiInstance.get(`/api/integrations/check_unique_integration_name?integration_name=${integrationName}`);
		return response.data;
	} catch (error) {
		console.error('Error checking integration name:', error);
		throw error;
	}
}

export const checkUniqueConnectionName = async (connectionName) => {
	try {
		const response = await apiInstance.get(`/api/connections/check_unique_connection_name?connection_name=${connectionName}`);
		return response.data;
	} catch (error) {
		console.error('Error checking integration name:', error);
		throw error;
	}
}

export const apiRefreshToken = async () => {
	try {
		const response = await apiInstance.post('/api/verification/refresh-token');
		return response.data;
	} catch (error) {
		throw error;
	}
};