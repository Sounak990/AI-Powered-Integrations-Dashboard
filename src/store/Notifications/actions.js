import * as actionTypes from './actionTypes';

export const addNotification = (notification) => {
  console.log("Dispatching notification:", notification);

  // Ensure notification is in a format the reducer expects
  const notificationPayload = Array.isArray(notification) ? notification : [notification];

  return {
    type: actionTypes.ADD_NOTIFICATION,
    payload: notificationPayload,
  };
};
