import { UserRepository } from './user.repository';
import { NotFoundException } from '../../shared/exceptions/not-found-exception';
import { activityService, ActivityType } from '../../shared/services/activity.service';
import {TUser} from '../../shared/database/db.types';
import {Selectable, Updateable} from 'kysely';
import {getStorageProvider} from '../../shared/providers/storage.provider';

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

  async getAllUsers(page = 1, limit = 10, search?: string): Promise<{ data: Omit<Selectable<TUser>, 'password'>[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userRepository.findAll(skip, limit, search),
      this.userRepository.count(search)
    ]);

    const mappedData = await Promise.all(data.map(user => this.mapToUserDTO(user)));
    return { data: mappedData, total };
  }

  async getUserById(id: string): Promise<Omit<Selectable<TUser>, 'password'>> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.mapToUserDTO(user);
  }

  async updateUser(id: string, data: Updateable<TUser>): Promise<Omit<Selectable<TUser>, 'password'>> {
    await this.getUserById(id); // Ensure exists
    const user = await this.userRepository.update(id, data);

    // Log Activity
    await activityService.recordActivity(id, ActivityType.PROFILE_UPDATE, 'User profile updated');

    return this.mapToUserDTO(user);
  }

  /**
   * Updates a user's avatar image and cleans up the old one.
   */
  async updateAvatar(id: string, file: Express.Multer.File): Promise<Omit<Selectable<TUser>, 'password'>> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    const storage = getStorageProvider();

    // 1. Upload new avatar
    const newAvatarPath = await storage.upload(file, 'avatars');

    // 2. Update database
    const updatedUser = await this.userRepository.update(id, {
      avatar: newAvatarPath
    });

    // 3. Cleanup old avatar file if it exists
    if (user.avatar) {
      // Don't wait for deletion to return the response
      storage.delete(user.avatar).catch((err) => {
        console.error(`Failed to cleanup old avatar for user ${id}:`, err);
      });
    }

    // 4. Log Activity
    await activityService.recordActivity(id, ActivityType.PROFILE_UPDATE, 'User avatar updated');

    return this.mapToUserDTO(updatedUser);
  }

  /**
   * Private helper to sanitize and enrich user data for public consumption.
   */
  private async mapToUserDTO(user: Selectable<TUser>): Promise<Omit<Selectable<TUser>, 'password'>> {
    const { password: _, ...userWithoutPassword } = user;
    const storage = getStorageProvider();

    return {
      ...userWithoutPassword,
      avatar: user.avatar ? await storage.getSignedUrl(user.avatar) : null
    };
  }
}
