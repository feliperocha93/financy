import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { GraphQLError } from 'graphql';

export const UserAlreadyExistsError = new GraphQLError('User already exists', { extensions: { code: 'USER_ALREADY_EXISTS', http: { status: 400 } } });
export const InvalidCredentialsError = new GraphQLError('Invalid credentials', { extensions: { code: 'INVALID_CREDENTIALS', http: { status: 400 } } });

export class AuthService {
  constructor(private readonly prisma: PrismaClient) { }

  async signup(name: string, email: string, password: string) {
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (user) throw UserAlreadyExistsError;

    const hashedPassword = await hashPassword(password);
    user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const token = generateToken(user.id); ''
    return { token, user };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw InvalidCredentialsError;
    const valid = await comparePassword(password, user.password);
    if (!valid) throw InvalidCredentialsError;
    const token = generateToken(user.id);
    return { token, user };
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
