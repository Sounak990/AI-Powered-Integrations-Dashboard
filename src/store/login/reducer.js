import * as actionTypes from './actionTypes';

const initialState = {
	user: null,
	error: null,
	loading: false,
	tokenExpiresAt: null,
};

const loginReducer = (state = initialState, action) => {
	console.log('loginReducer:', action.type, action.payload);
	switch (action.type) {
		case actionTypes.LOGIN_REQUEST:
			return { ...state, loading: true, error: null };
		case actionTypes.LOGIN_SUCCESS:
			return { ...state, loading: false, user: action.payload, hasOnboarded: action.payload.has_onboarded };
		case actionTypes.LOGIN_FAILURE:
			return { ...state, loading: false, error: action.payload };
		case actionTypes.REFRESH_TOKEN_REQUEST:
			return { ...state, loading: true };
		case actionTypes.REFRESH_TOKEN_SUCCESS:
			return { ...state, loading: false, user: { ...state.user, access_token: action.payload } };
		case actionTypes.REFRESH_TOKEN_FAILURE:
			return { ...state, loading: false, error: action.payload };
		case actionTypes.SET_TOKEN_EXPIRATION:
			return { ...state, tokenExpiresAt: action.payload };
		case actionTypes.LOGOUT:
			return { ...initialState }; // Reset to initial state
		default:
			return state;
	}
};

export default loginReducer;
