import PushNotification, { Importance } from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import { Task } from '../types/models';

// Configure notifications
const configurePushNotifications = () => {
  PushNotification.configure({
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },

    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);

      // Required for iOS
      if (Platform.OS === 'ios') {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      }
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    popInitialNotification: true,
    requestPermissions: true,
  });

  // Create notification channel for Android
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: 'task-reminders',
        channelName: 'Recordatorios de Tareas',
        channelDescription: 'Notificaciones para recordatorios de tareas agrícolas',
        playSound: true,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`Channel 'task-reminders' created: ${created}`)
    );
  }
};

// Schedule a task reminder
const scheduleTaskReminder = (task: Task, reminderTime: Date) => {
  const notificationId = task.id;

  // Cancel any existing notification for this task
  cancelTaskReminder(notificationId);

  // Get notification time
  const notificationTime = reminderTime.getTime();

  // Don't schedule if the time has passed
  if (notificationTime <= Date.now()) {
    console.log('Reminder time has already passed');
    return;
  }

  // Create notification
  PushNotification.localNotificationSchedule({
    id: notificationId,
    channelId: 'task-reminders',
    title: `Recordatorio: ${task.title}`,
    message: task.description || 'Tarea pendiente',
    date: reminderTime,
    allowWhileIdle: true,
    repeatType: undefined,
    userInfo: {
      taskId: task.id,
      type: 'task-reminder',
    },
    // Android specific
    largeIcon: 'ic_launcher',
    smallIcon: 'ic_notification',
    priority: 'high',
    vibrate: true,
    vibration: 300,
    // iOS specific
    category: 'task',
  });
};

// Schedule multiple reminders for a task
const scheduleTaskReminders = (task: Task, reminderTimes: Date[]) => {
  reminderTimes.forEach(time => scheduleTaskReminder(task, time));
};

// Cancel a specific task reminder
const cancelTaskReminder = (taskId: string) => {
  PushNotification.cancelLocalNotification(taskId);
};

// Cancel all task reminders
const cancelAllTaskReminders = () => {
  PushNotification.cancelAllLocalNotifications();
};

// Get all scheduled notifications
const getScheduledNotifications = () => {
  return new Promise((resolve) => {
    PushNotification.getScheduledLocalNotifications(notifications => {
      resolve(notifications);
    });
  });
};

// Calculate default reminder times for a task
const calculateReminderTimes = (task: Task): Date[] => {
  const reminderTimes: Date[] = [];
  const dueDate = new Date(task.dueDate);

  // Add reminders based on task priority
  switch (task.priority) {
    case 'high':
      // 1 day, 12 hours, and 2 hours before
      reminderTimes.push(new Date(dueDate.getTime() - 24 * 60 * 60 * 1000));
      reminderTimes.push(new Date(dueDate.getTime() - 12 * 60 * 60 * 1000));
      reminderTimes.push(new Date(dueDate.getTime() - 2 * 60 * 60 * 1000));
      break;
    case 'medium':
      // 1 day and 4 hours before
      reminderTimes.push(new Date(dueDate.getTime() - 24 * 60 * 60 * 1000));
      reminderTimes.push(new Date(dueDate.getTime() - 4 * 60 * 60 * 1000));
      break;
    case 'low':
      // Just 12 hours before
      reminderTimes.push(new Date(dueDate.getTime() - 12 * 60 * 60 * 1000));
      break;
  }

  // Filter out past times
  return reminderTimes.filter(time => time.getTime() > Date.now());
};

// Update task reminders when task is modified
const updateTaskReminders = (task: Task) => {
  // Cancel existing reminders
  cancelTaskReminder(task.id);

  // Don't schedule reminders for completed or cancelled tasks
  if (task.status === 'completed' || task.status === 'cancelled') {
    return;
  }

  // Calculate and schedule new reminders
  const reminderTimes = calculateReminderTimes(task);
  scheduleTaskReminders(task, reminderTimes);
};

// Handle task completion
const handleTaskCompletion = (taskId: string) => {
  cancelTaskReminder(taskId);
};

export const notificationService = {
  configurePushNotifications,
  scheduleTaskReminder,
  scheduleTaskReminders,
  cancelTaskReminder,
  cancelAllTaskReminders,
  getScheduledNotifications,
  calculateReminderTimes,
  updateTaskReminders,
  handleTaskCompletion,
};

export default notificationService;
