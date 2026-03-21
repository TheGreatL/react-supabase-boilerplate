import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

interface ErrorScreenProps {
  error: Error
}

export function ErrorScreen({ error }: ErrorScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-red-50 text-red-500">
            <AlertTriangle size={48} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Oops! Something went wrong
          </h1>
          <p className="text-slate-500 text-sm">
            {error.message ||
              'An unexpected error occurred. Please try again later.'}
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && error.stack && (
          <div className="p-4 bg-slate-100 rounded-lg text-left overflow-auto max-h-40">
            <pre className="text-[10px] text-slate-700 font-mono italic">
              {error.stack}
            </pre>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all active:scale-95"
          >
            <RefreshCcw size={16} />
            Retry
          </button>
          <a
            href="/"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <Home size={16} />
            Home
          </a>
        </div>
      </div>
    </div>
  )
}
