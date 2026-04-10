import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import { Button } from '@/shared/components/ui/button'
import { LoadingDashboard } from '@/features/dashboard/components/loading-dashboard'
import {
  StatsWidget,
  ActivityWidget,
} from '@/features/dashboard/components/dashboard-widgets'

export const Route = createFileRoute('/_protected/dashboard')({
  component: DashboardComponent,
  pendingComponent: LoadingDashboard,
})

function DashboardComponent() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="animate-in fade-in slide-in-from-top-4 container mx-auto px-4 py-8 duration-500">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName} {user?.lastName}!
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/settings')}
            >
              Settings
            </Button>
            <Button onClick={logout}>Logout</Button>
          </div>
        </div>

        {/* Global Statistics */}
        <StatsWidget />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content Area */}
          <div className="space-y-6 lg:col-span-2">
            <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
              <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                My Profile
              </h3>
              <div className="flex items-center gap-4">
                <div className="bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold uppercase">
                  {user?.firstName ?? ''}
                  {user?.lastName ?? ''}
                </div>
                <div>
                  <p className="text-foreground text-lg font-bold">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-muted-foreground text-sm">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="border-border bg-muted/30 text-muted-foreground rounded-2xl border p-6 text-center italic">
              Future "Main Widgets" (e.g. Charts, Tables) will go here...
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <ActivityWidget />
          </div>
        </div>
      </div>
    </div>
  )
}
