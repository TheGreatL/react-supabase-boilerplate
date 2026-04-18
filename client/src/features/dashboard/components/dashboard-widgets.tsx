import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../dashboard.service'
import QUERY_KEYS from '@/shared/constants/query-keys'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'

/**
 * Dashboard Stats Widget
 */
export const StatsWidget = () => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.dashboardStats],
    queryFn: () => dashboardService.getStats(),
  })

  if (isLoading)
    return (
      <div className="flex h-32 animate-pulse items-center justify-center rounded-xl border bg-slate-50">
        Loading stats...
      </div>
    )

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <StatCard
        title="Total Users"
        value={data?.totalUsers}
        trend={data?.growthRate}
      />
      <StatCard title="System Activities" value={data?.totalActivities} />
      <StatCard title="Active Today" value={data?.activeUsersToday} />
      <StatCard title="Health" value="100%" />
    </div>
  )
}

const StatCard = ({
  title,
  value,
  trend,
}: {
  title: string
  value: any
  trend?: string
}) => (
  <Card className="border-border bg-card transition-shadow duration-300 hover:shadow-md">
    <CardHeader className="pb-2">
      <p className="text-muted-foreground text-xs font-medium">{title}</p>
    </CardHeader>
    <CardContent>
      <div className="flex items-baseline justify-between">
        <h3 className="text-foreground text-2xl font-bold">{value}</h3>
        {trend && (
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20"
          >
            {trend}
          </Badge>
        )}
      </div>
    </CardContent>
  </Card>
)

/**
 * Activity Log Widget
 */
export const ActivityWidget = () => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.dashboardActivities],
    queryFn: () => dashboardService.getActivities(),
  })

  if (isLoading)
    return (
      <div className="border-border bg-muted/50 text-muted-foreground flex h-64 animate-pulse items-center justify-center rounded-xl border text-sm">
        Loading activity...
      </div>
    )

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.map((activity) => (
            <div
              key={activity.id}
              className="border-border/50 flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="flex flex-col">
                <p className="text-foreground text-sm font-medium">
                  {activity.title}
                </p>
                <p className="text-muted-foreground text-xs">
                  {activity.performer.firstName} {activity.performer.lastName} (
                  {activity.performer.email})
                </p>
              </div>
              <span className="text-muted-foreground/60 text-[10px] font-medium">
                {new Date(activity.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
          {data?.length === 0 && (
            <p className="text-muted-foreground py-4 text-center text-sm">
              No recent activity found.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
