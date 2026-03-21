import { AlertTriangle, Home } from 'lucide-react'

export function NotFoundScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 text-slate-400">
          <AlertTriangle size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            404
          </h1>
          <h2 className="text-xl font-semibold text-slate-600">
            Page not found
          </h2>
          <p className="text-slate-400 max-w-xs mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved or deleted.
          </p>
        </div>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          <Home size={18} />
          Back to Home
        </a>
      </div>
    </div>
  )
}
