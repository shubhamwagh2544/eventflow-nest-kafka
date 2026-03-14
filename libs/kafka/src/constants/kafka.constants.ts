export const KAFKA_BROKER = process.env.KAFKA_BROKER ?? 'localhost:9092';
export const KAFKA_CLIENT_ID = 'eventflowapp';
export const KAFKA_CONSUMER_GROUP = 'eventflowapp-consumer';

export const KAAFKA_TOPICS = {
  // Auth Events
  USER_REGISTERED: 'user.registered',
  USER_LOGIN: 'user.login',
  PASSWORD_RESET_REQUESTED: 'password.reset-required',

  // Events events
  EVENT_CREATED: 'event.created',
  EVENT_UPDATED: 'event.updated',
  EVENT_CANCELLED: 'event.cancelled',

  // Ticket events
  TICKET_PURCHASED: 'ticket.purchased',
  TICKET_CANCELLED: 'ticket.cancelled',
  TICKET_CHECKED_IN: 'ticket.checked-in',

  // Payment events
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUNDED: 'payment.refunded',

  // Notification events
  SEND_EMAIL: 'notification.send-email',
  SEND_PUSH: 'notification.send-push',
} as const;

export type KafkaTopics = (typeof KAAFKA_TOPICS)[keyof typeof KAAFKA_TOPICS];
