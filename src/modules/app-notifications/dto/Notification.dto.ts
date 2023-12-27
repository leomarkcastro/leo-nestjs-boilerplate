export class NotificationClass {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  title: string;
  content: string;
}

export const NotificationType = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
};
