export function LoadingScreen() {
  return (
    <div className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-white/60 backdrop-blur-[2px] duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-20"></span>
          <div className="relative inline-flex h-16 w-16 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="animate-pulse text-sm font-semibold text-indigo-900">
            Loading...
          </p>
          <p className="text-xs text-slate-400">Please wait a moment</p>
        </div>
      </div>
    </div>
  )
}
