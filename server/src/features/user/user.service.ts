import {UserRepository} from './user.repository';
import {NotFoundException} from '../../shared/exceptions/not-found-exception';
import {activityService} from '../../shared/services/activity.service';
import {Users} from '../../shared/database/db.types';
import {Selectable, Updateable} from 'kysely';
import {getStorageProvider} from '../../shared/providers/storage.provider';
import {RBACService} from '../rbac/rbac.service';

export interface TUserDTO extends Omit<Selectable<Users>, 'password'> {
  roles: string[];
  permissions: string[];
}

export interface TUserPaginatedResponse {
  data: TUserDTO[];
  total: number;
}

/**
 * Gold Standard:
 * UserService handles business logic for user management.
 * Integrated with ActivityService for audit logging.
 */
export class UserService {
  private userRepository: UserRepository;
  private rbacService: RBACService;

  constructor() {
    this.userRepository = new UserRepository();
    this.rbacService = new RBACService();
  }

  async getAllUsers(page = 1, limit = 10, search?: string): Promise<TUserPaginatedResponse> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userRepository.findAll(skip, limit, search),
      this.userRepository.count(search)
    ]);

    const mappedData = await Promise.all(data.map((user) => this.mapToUserDTO(user)));
    return {data: mappedData, total};
  }

  async getUserById(id: string): Promise<TUserDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.mapToUserDTO(user);
  }

  async updateUser(id: string, data: Updateable<Users>): Promise<TUserDTO> {
    await this.getUserById(id); // Ensure exists
    const user = await this.userRepository.update(id, data);

    // Log Activity
    await activityService.recordLog(id, 'USERS', 'Profile Updated', `User ${id} updated their profile`);

    return this.mapToUserDTO(user);
  }

  /**
   * Updates a user's profile photo image and cleans up the old one.
   */
  async updateProfilePhoto(id: string, file: Express.Multer.File): Promise<TUserDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    const storage = getStorageProvider();

    // 1. Upload new photo
    const newPhotoPath = await storage.upload(file, 'profile-photos');

    // 2. Update database
    const updatedUser = await this.userRepository.update(id, {
      profilePhoto: newPhotoPath
    });

    // 3. Cleanup old photo file if it exists
    if (user.profilePhoto) {
      // Don't wait for deletion to return the response
      storage.delete(user.profilePhoto).catch((err) => {
        console.error(`Failed to cleanup old profile photo for user ${id}:`, err);
      });
    }

    // 4. Log Activity
    await activityService.recordLog(id, 'USERS', 'Photo Updated', 'User updated their profile photo');

    return this.mapToUserDTO(updatedUser);
  }

  /**
   * Private helper to sanitize and enrich user data for public consumption.
   */
  private async mapToUserDTO(user: Selectable<Users>): Promise<TUserDTO> {
    const {password: _, ...userWithoutPassword} = user;
    const storage = getStorageProvider();

    const [roles, permissionsData] = await Promise.all([
      this.rbacService.getUserRoles(user.id),
      this.rbacService.getUserPermissions(user.id)
    ]);

    const permissions = permissionsData.map((p) => `${p.module}:${p.permission}`);

    return {
      ...userWithoutPassword,
      roles,
      permissions,
      profilePhoto: user.profilePhoto ? await storage.getSignedUrl(user.profilePhoto) : null
    };
  }
}
