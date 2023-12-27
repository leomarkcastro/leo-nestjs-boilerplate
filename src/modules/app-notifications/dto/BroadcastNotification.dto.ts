export class BroadcastNotificationDto {
  title: string;
  content: string;
  type: string;
}

export class CreateBroadcastNotificationDto extends BroadcastNotificationDto {
  receivers: string[];
}

export class NotificationDeleteDto {
  ids: string[];
}
