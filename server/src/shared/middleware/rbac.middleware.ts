import {Response, NextFunction} from 'express';
import {TAuthenticatedRequest} from '../types/auth.types';
import {ForbiddenException} from '../exceptions/forbidden-exception';
import {RBACService} from '../../features/rbac/rbac.service';

/**
 * RBAC Authorization Middleware
 *
 * Checks if the authenticated user has a specific permission for a module.
 * Must be used AFTER authMiddleware.
 *
 * @param module - The module name to check (e.g., 'USERS', 'DASHBOARD')
 * @param permission - The permission required (e.g., 'READ', 'CREATE', 'DELETE')
 *
 * @example
 * route.get('/', authMiddleware, authorize('USERS', 'READ'), UserController.getUsers);
 */
const rbacService = new RBACService();
export const authorize = (module: string, permission: string) => {
  return async (req: TAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ForbiddenException('User context not found');
      }

      const userPermissions = await rbacService.getUserPermissions(req.user.id);

      const hasPermission = userPermissions.some((p: {module: string; permission: string}) => p.module === module && p.permission === permission);

      if (!hasPermission) {
        throw new ForbiddenException(`Insufficient permissions for module: ${module}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * (Optional) Check if user has ANY of the specified roles.
 * Useful for high-level administrative checks.
 */
export const requireAnyRole = (allowedRoles: string[]) => {
  return (req: TAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ForbiddenException('User context not found');
      }

      const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));

      if (!hasRole) {
        throw new ForbiddenException('Insufficient role permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
