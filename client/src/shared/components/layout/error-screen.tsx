import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

interface ErrorScreenProps {
  error: Error
}

export function ErrorScreen({ error }: ErrorScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <div className="animate-in fade-in zoom-in-95 w-full max-w-md space-y-6 rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-xl shadow-slate-200/50 duration-500">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-50 p-4 text-red-500">
            <AlertTriangle size={48} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Oops! Something went wrong
          </h1>
          <p className="text-sm text-slate-500">
            {error.message ||
              'An unexpected error occurred. Please try again later.'}
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && error.stack && (
          <div className="max-h-40 overflow-auto rounded-lg bg-slate-100 p-4 text-left">
            <pre className="font-mono text-[10px] text-slate-700 italic">
              {error.stack}
            </pre>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 active:scale-95"
          >
            <RefreshCcw size={16} />
            Retry
          </button>
          <a
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95"
          >
            <Home size={16} />
            Home
          </a>
        </div>
      </div>
    </div>
  )
}
