// Utility function for showing notifications
export const showNotification = (type, message, duration = 3000) => {
  const event = new CustomEvent('show-notification', {
    detail: { type, message, duration }
  });
  window.dispatchEvent(event);
};
