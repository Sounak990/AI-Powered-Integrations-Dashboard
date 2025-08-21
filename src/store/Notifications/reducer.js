import * as actionTypes from './actionTypes';

const initialState = {
  notifications: [],  // Initialize as an empty array
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_NOTIFICATION:
      console.log("Notification added to state:", action.payload);

      // Ensure the payload is always treated as an array
      const newNotifications = Array.isArray(action.payload) ? action.payload : [action.payload];

      // Replace the current notifications with the new ones
      return {
        ...state,
        notifications: newNotifications,
      };

    default:
      return state;
  }
};

export default notificationReducer;
