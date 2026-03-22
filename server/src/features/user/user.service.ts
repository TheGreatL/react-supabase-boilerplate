import {User, Prisma} from '@prisma/client';
import {UserRepository} from './user.repository';
import {NotFoundException} from '../../shared/exceptions/not-found-exception';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(page = 1, limit = 10, search?: string): Promise<{data: User[]; total: number}> {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput =
      search ?
        {
          OR: [
            {email: {contains: search, mode: 'insensitive'}},
            {firstName: {contains: search, mode: 'insensitive'}},
            {lastName: {contains: search, mode: 'insensitive'}}
          ]
        }
      : {};

    const [data, total] = await Promise.all([
      this.userRepository.findAll(skip, limit, where),
      this.userRepository.count(where)
    ]);
    return {data, total};
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    await this.getUserById(id); // Ensure exists
    return this.userRepository.update(id, data);
  }
}
