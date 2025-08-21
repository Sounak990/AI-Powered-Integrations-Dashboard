import * as actionTypes from './actionTypes';

const initialState = {
  message: '',
  error: null,
  loading: false,
};

const supportReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SUBMIT_SUPPORT_FORM:
      return { ...state, loading: true };
    case actionTypes.SUPPORT_FORM_SUCCESS:
      return { ...state, loading: false, message: action.payload };
    case actionTypes.SUPPORT_FORM_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default supportReducer;
