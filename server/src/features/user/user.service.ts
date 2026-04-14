import { UserRepository } from './user.repository';
import { NotFoundException } from '../../shared/exceptions/not-found-exception';
import { User } from '../../shared/types/db';
import { Selectable, Updateable } from 'kysely';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(page = 1, limit = 10, search?: string): Promise<{ data: Selectable<User>[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userRepository.findAll(skip, limit, search),
      this.userRepository.count(search)
    ]);
    return { data, total };
  }

  async getUserById(id: string): Promise<Selectable<User>> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, data: Updateable<User>): Promise<Selectable<User>> {
    await this.getUserById(id); // Ensure exists
    return this.userRepository.update(id, data);
  }
}
