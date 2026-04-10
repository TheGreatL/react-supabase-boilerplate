export function LoadingScreen() {
  return (
    <div className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-background/60 backdrop-blur-[0.125rem] duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-20"></span>
          <div className="relative inline-flex h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="animate-pulse text-sm font-semibold text-foreground">
            Loading...
          </p>
          <p className="text-xs text-muted-foreground">Please wait a moment</p>
        </div>
      </div>
    </div>
  )
}
