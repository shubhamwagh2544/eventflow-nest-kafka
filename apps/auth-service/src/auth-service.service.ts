import { KAAFKA_TOPICS, KAFKA_SERVICE } from '@app/kafka';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AuthServiceService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  getHello(): string {
    return 'hello world!';
  }

  simulateUserRegistration(email: string) {
    this.kafkaClient.emit(KAAFKA_TOPICS.USER_REGISTERED, {
      email,
      timestamp: new Date().toISOString(),
    });
    return { message: `user registered: ${email}` };
  }
}
