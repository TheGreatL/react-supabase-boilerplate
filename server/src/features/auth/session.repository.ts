import {Prisma} from '@prisma/client';
import {prisma} from '../../shared/lib/prisma';

export class SessionRepository {
  async create(data: {userId: string; refreshToken: string; expiresAt: Date}) {
    return await prisma.session.create({
      data: {
        userId: data.userId,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
        lastLogin: new Date()
      }
    });
  }

  async findByToken(refreshToken: string): Promise<Prisma.SessionGetPayload<{include: {user: true}}> | null> {
    return await prisma.session.findUnique({
      where: {refreshToken},
      include: {user: true}
    });
  }

  async deleteByToken(refreshToken: string) {
    return await prisma.session.delete({
      where: {refreshToken}
    });
  }

  async deleteExpired() {
    return await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }

  async deleteAllUserSessions(userId: string) {
    return await prisma.session.deleteMany({
      where: {userId}
    });
  }
}
