import { UserRepository } from './user.repository';
import { NotFoundException } from '../../shared/exceptions/not-found-exception';
import { activityService, ActivityType } from '../../shared/services/activity.service';
import { TUser } from '../../shared/database/db.types';
import { Selectable, Updateable } from 'kysely';

/**
 * Gold Standard:
 * UserService handles business logic for user management.
 * Integrated with ActivityService for audit logging.
 */
export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(page = 1, limit = 10, search?: string): Promise<{ data: Selectable<TUser>[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userRepository.findAll(skip, limit, search),
      this.userRepository.count(search)
    ]);
    return { data, total };
  }

  async getUserById(id: string): Promise<Selectable<TUser>> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, data: Updateable<TUser>): Promise<Selectable<TUser>> {
    await this.getUserById(id); // Ensure exists
    const user = await this.userRepository.update(id, data);
    
    // Log Activity
    await activityService.recordActivity(id, ActivityType.PROFILE_UPDATE, 'User profile updated');
    
    return user;
  }
}
