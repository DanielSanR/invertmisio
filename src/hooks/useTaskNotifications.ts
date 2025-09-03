import { useEffect, useCallback } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import notificationService from '../services/notificationService';
import type { Task } from '../types/models';

interface UseTaskNotificationsOptions {
  onPermissionDenied?: () => void;
}

export const useTaskNotifications = (options: UseTaskNotificationsOptions = {}) => {
  const { onPermissionDenied } = options;

  // Simplified permission check without external dependencies
  const checkNotificationPermissions = useCallback(async () => {
    try {
      // For now, assume permissions are granted
      // In a real app, you would check actual permissions
      return true;
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return false;
    }
  }, []);

  // Initialize notifications on mount
  useEffect(() => {
    const initializeNotifications = async () => {
      const hasPermission = await checkNotificationPermissions();
      if (hasPermission) {
        notificationService.configurePushNotifications();
      }
    };

    initializeNotifications();
  }, [checkNotificationPermissions]);

  // Schedule reminders for a task
  const scheduleTaskReminders = useCallback(async (task: Task) => {
    const hasPermission = await checkNotificationPermissions();
    if (!hasPermission) return;

    const reminderTimes = notificationService.calculateReminderTimes(task);
    notificationService.scheduleTaskReminders(task, reminderTimes);
  }, [checkNotificationPermissions]);

  // Update reminders when a task is modified
  const updateTaskReminders = useCallback(async (task: Task) => {
    const hasPermission = await checkNotificationPermissions();
    if (!hasPermission) return;

    notificationService.updateTaskReminders(task);
  }, [checkNotificationPermissions]);

  // Cancel reminders for a task
  const cancelTaskReminders = useCallback((taskId: string) => {
    notificationService.cancelTaskReminder(taskId);
  }, []);

  // Get all scheduled notifications
  const getScheduledReminders = useCallback(async () => {
    return await notificationService.getScheduledNotifications();
  }, []);

  return {
    scheduleTaskReminders,
    updateTaskReminders,
    cancelTaskReminders,
    getScheduledReminders,
  };
};

export default useTaskNotifications;
