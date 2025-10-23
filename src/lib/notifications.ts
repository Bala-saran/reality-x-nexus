export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendBrowserNotification = (title: string, options?: NotificationOptions) => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
  }
};

export const subscribeToNotifications = async () => {
  const permission = await requestNotificationPermission();
  if (permission) {
    // Store subscription in localStorage to track which users have subscribed
    localStorage.setItem('notificationsEnabled', 'true');
    return true;
  }
  return false;
};

export const isNotificationsEnabled = (): boolean => {
  return localStorage.getItem('notificationsEnabled') === 'true' && Notification.permission === 'granted';
};
