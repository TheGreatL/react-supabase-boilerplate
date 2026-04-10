export function LoadingDashboard() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        <p className="text-muted-foreground text-sm font-medium">
          Loading Dashboard...
        </p>
      </div>
    </div>
  )
}
