import {RBACRepository} from './rbac.repository';

export class RBACService {
  private rbacRepository: RBACRepository;

  constructor() {
    this.rbacRepository = new RBACRepository();
  }

  async getUserPermissions(userId: string): Promise<{module: string; permission: string}[]> {
    return await this.rbacRepository.getUserPermissions(userId);
  }

  async getUserRoles(userId: string): Promise<string[]> {
    return await this.rbacRepository.getUserRoles(userId);
  }

  async assignRoleToUser(userId: string, roleName: string): Promise<void> {
    const role = await this.rbacRepository.findRoleByName(roleName);
    if (!role) {
      throw new Error(`Role ${roleName} not found`);
    }
    await this.rbacRepository.assignRoleToUser(userId, role.id);
  }
}
