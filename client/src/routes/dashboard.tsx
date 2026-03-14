import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '../shared/stores/auth.store'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ location }) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: DashboardComponent,
  pendingComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-sm font-medium text-slate-500">Loading Dashboard...</p>
      </div>
    </div>
  ),
})

function DashboardComponent() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="p-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="text-slate-500">
              Welcome back, {user?.firstName} {user?.lastName}!
            </p>
          </div>
          <button
            onClick={logout}
            className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors active:scale-95"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <h3 className="text-sm font-medium text-slate-400">Account Type</h3>
            <p className="text-xl font-bold text-slate-900 uppercase">
              {user?.role}
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm col-span-2">
            <h3 className="text-sm font-medium text-slate-400">Email Address</h3>
            <p className="text-xl font-bold text-slate-900">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
