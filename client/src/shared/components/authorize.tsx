import type { ReactNode } from 'react'
import { useAuthStore } from '../stores/auth.store'

interface AuthorizeProps {
  /**
   * The module name to check (e.g., 'USERS', 'DASHBOARD')
   */
  module: string
  /**
   * The permission required (e.g., 'READ', 'CREATE')
   */
  permission: string
  /**
   * Optional: Specific roles that also grant access regardless of permissions
   */
  roles?: string[]
  /**
   * Content to render if permission is granted
   */
  children: ReactNode
  /**
   * Optional: Content to render if permission is denied
   */
  fallback?: ReactNode
}

/**
 * Authorize Component
 *
 * Granular RBAC component for conditional UI rendering.
 * Checks if the current user has the required module:permission pair.
 *
 * @example
 * <Authorize module="USERS" permission="CREATE">
 *   <button>Add User</button>
 * </Authorize>
 */
export const Authorize = ({
  module,
  permission,
  roles = [],
  children,
  fallback = null,
}: AuthorizeProps) => {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !user) {
    return fallback
  }

  // 1. Check if user has any of the override roles (e.g., SUPER_ADMIN)
  const hasRole = roles.length > 0 && user.roles.some((r) => roles.includes(r))
  if (hasRole || user.roles.includes('SUPER_ADMIN')) {
    return <>{children}</>
  }

  // 2. Check for specific module:permission
  const requiredPermission = `${module}:${permission}`
  const hasPermission =
    user.permissions.includes(requiredPermission) ||
    user.permissions.includes(`${module}:*`)

  if (hasPermission) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

/**
 * Hook version of the Authorize component for logic-based checks.
 */
export const useAuthorize = () => {
  const { user } = useAuthStore()

  const authorize = (
    module: string,
    permission: string,
    roles: string[] = [],
  ) => {
    if (!user) {
      return false
    }

    if (
      user.roles.includes('SUPER_ADMIN') ||
      (roles.length > 0 && user.roles.some((r) => roles.includes(r)))
    ) {
      return true
    }

    const requiredPermission = `${module}:${permission}`
    return (
      user.permissions.includes(requiredPermission) ||
      user.permissions.includes(`${module}:*`)
    )
  }

  return { authorize }
}
