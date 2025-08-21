// src/redux/reducers/kbReducer.js
import { FETCH_KB_REQUEST, FETCH_KB_SUCCESS, FETCH_KB_FAILURE } from './actionTypes';

const initialState = {
  data: [],
  loading: false,
  error: null
};

const kbReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_KB_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_KB_SUCCESS:
      return { ...state, loading: false, data: action.payload.data };
    case FETCH_KB_FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    default:
      return state;
  }
};

export default kbReducer;
