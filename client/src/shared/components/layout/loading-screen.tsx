export function LoadingScreen() {
  return (
    <div className="animate-in fade-in bg-background/60 fixed inset-0 z-100 flex items-center justify-center backdrop-blur-[0.125rem] duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16">
          <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-20"></span>
          <div className="border-primary relative inline-flex h-16 w-16 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-foreground animate-pulse text-sm font-semibold">
            Loading...
          </p>
          <p className="text-muted-foreground text-xs">Please wait a moment</p>
        </div>
      </div>
    </div>
  )
}
