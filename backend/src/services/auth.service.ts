import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

export class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  async signup(name: string, email: string, password: string) {
    const hashedPassword = await hashPassword(password);
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const token = generateToken(user.id);
    return { token, user };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');
    const valid = await comparePassword(password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    const token = generateToken(user.id);
    return { token, user };
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
