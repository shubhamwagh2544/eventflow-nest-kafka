import { DatabaseService, users } from '@app/database';
import { KAAFKA_TOPICS, KAFKA_SERVICE } from '@app/kafka';
import {
  ConflictException,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthServiceService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async register(email: string, password: string, name: string) {
    // check if user exists
    const existingUser = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new ConflictException('Email already in use');
    }

    // hash password
    const hashedpassword = await bcrypt.hash(password, 10);

    // create user
    const [user] = await this.databaseService.db
      .insert(users)
      .values({
        email,
        password: hashedpassword,
        name,
      })
      .returning();

    // publish user.registered event
    this.kafkaClient.emit(KAAFKA_TOPICS.USER_REGISTERED, {
      userId: user.id,
      email: user.email,
      name: user.name,
      timestamp: new Date().toISOString(),
    });

    return {
      message: 'User registered successfully',
      userId: user.id,
    };
  }

  async login(email: string, password: string) {
    // find user by email
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // sign jwt token
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    // send kafka event
    this.kafkaClient.emit(KAAFKA_TOPICS.USER_LOGIN, {
      userId: user.id,
      email: user.email,
      name: user.name,
      timestamp: new Date().toISOString(),
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async getProfile(userId: string) {
    const [user] = await this.databaseService.db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('User not Found');
    }

    return { user };
  }
}
