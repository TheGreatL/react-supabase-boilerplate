import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import { Button } from '@/shared/components/ui/button'
import { LoadingDashboard } from '@/features/dashboard/components/loading-dashboard'

export const Route = createFileRoute('/_protected/dashboard')({
  component: DashboardComponent,
  pendingComponent: LoadingDashboard,
})

function DashboardComponent() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="animate-in fade-in slide-in-from-top-4 p-8 duration-500">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="text-slate-500">
              Welcome back, {user?.firstName} {user?.lastName}!
            </p>
          </div>
          <Button onClick={logout}>Logout</Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-slate-400">Account Type</h3>
            <p className="text-xl font-bold text-slate-900 uppercase">
              {user?.role}
            </p>
          </div>
          <div className="col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-slate-400">
              Email Address
            </h3>
            <p className="text-xl font-bold text-slate-900">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
