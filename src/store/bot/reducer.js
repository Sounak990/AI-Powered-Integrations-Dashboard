import {
  SET_BOT_DATA
} from "./actionTypes"

const initialState = {
  botData: [],
  };


const botReducer = (state = initialState, action) => {
  switch (action.type) {
  case SET_BOT_DATA:
  return {
  ...state,
  botData: action.payload,
  };
  default:
  return state;
  }
  };
  
  export default botReducer;