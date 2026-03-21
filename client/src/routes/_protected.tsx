import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useEffect, useState } from 'react'
import { LoadingDashboard } from '@/features/dashboard/components/loading-dashboard'

export const Route = createFileRoute('/_protected')({
  component: ProtectedLayout,
})

function ProtectedLayout() {
  const { isAuthenticated, hasHydrated, initialize } = useAuthStore()
  const navigate = useNavigate()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // 1. Wait for Zustand to finish loading from localStorage
    if (!hasHydrated) return

    // 2. If loaded but not authenticated, bounce to login
    if (!isAuthenticated) {
      navigate({
        to: '/login',
        // Optional: search: { redirect: window.location.pathname }
      })
      return
    }

    // 3. If authenticated, fetch user data to ensure session is still valid
    initialize().finally(() => {
      setIsReady(true)
    })
  }, [hasHydrated, isAuthenticated, initialize, navigate])

  // Prevent flashing unauthenticated content during SSR or while waiting for hydration/profile
  const isServer = typeof window === 'undefined'
  
  if (isServer || !hasHydrated || !isAuthenticated || !isReady) {
    return <LoadingDashboard />
  }

  return <Outlet />
}
