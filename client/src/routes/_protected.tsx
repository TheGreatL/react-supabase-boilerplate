import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/shared/stores/auth.store'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location }) => {
    // Read the strictly latest state immediately. 
    // Zustand's persist with localStorage is completely synchronous, so hydration is already finished.
    const { isAuthenticated, initialize } = useAuthStore.getState()

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }

    // Initialize user session (e.g. get profile info) as expected
    await initialize()
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  return <Outlet />
}
