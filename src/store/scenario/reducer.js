import * as actionTypes from './actionTypes';

const initialState = {
  loading: false,
  salesScenario: null,
  error: null,
};

const salesScenarioReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SALES_SCENARIO_REQUEST:
      return { ...state, loading: true };
    case actionTypes.FETCH_SALES_SCENARIO_SUCCESS:
      return { ...state, loading: false, salesScenario: action.payload };
    case actionTypes.FETCH_SALES_SCENARIO_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default salesScenarioReducer;
