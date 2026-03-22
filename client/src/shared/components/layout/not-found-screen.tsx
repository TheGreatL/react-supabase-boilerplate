import { AlertTriangle, Home } from 'lucide-react'

export function NotFoundScreen() {
  return (
    <div className="animate-in fade-in zoom-in-95 flex min-h-[70vh] flex-col items-center justify-center p-6 text-center duration-500">
      <div className="space-y-6">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <AlertTriangle size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            404
          </h1>
          <h2 className="text-xl font-semibold text-slate-600">
            Page not found
          </h2>
          <p className="mx-auto max-w-xs text-slate-400">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved or deleted.
          </p>
        </div>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95"
        >
          <Home size={18} />
          Back to Home
        </a>
      </div>
    </div>
  )
}
