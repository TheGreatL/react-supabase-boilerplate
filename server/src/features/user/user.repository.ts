import {Prisma, User} from '@prisma/client';
import {prisma} from '../../shared/lib/prisma';
export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {id}
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {email}
    });
  }

  async findAll(skip?: number, take?: number, where?: Prisma.UserWhereInput): Promise<User[]> {
    return await prisma.user.findMany({
      skip,
      take,
      where
    });
  }

  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return await prisma.user.count({where});
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return await prisma.user.update({
      where: {id},
      data
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({
      data
    });
  }
}
