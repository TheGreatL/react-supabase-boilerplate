export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/60 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-20"></span>
          <div className="relative inline-flex rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-semibold text-indigo-900 animate-pulse">
            Loading...
          </p>
          <p className="text-xs text-slate-400">Please wait a moment</p>
        </div>
      </div>
    </div>
  )
}
