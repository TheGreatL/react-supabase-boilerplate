import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

interface ErrorScreenProps {
  error: Error
}

export function ErrorScreen({ error }: ErrorScreenProps) {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-6">
      <div className="animate-in fade-in zoom-in-95 border-border bg-card w-full max-w-md space-y-6 rounded-2xl border p-8 text-center shadow-xl duration-500">
        <div className="flex justify-center">
          <div className="bg-destructive/10 text-destructive rounded-full p-4">
            <AlertTriangle size={48} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-foreground text-2xl font-bold">
            Oops! Something went wrong
          </h1>
          <p className="text-muted-foreground text-sm">
            {error.message ||
              'An unexpected error occurred. Please try again later.'}
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && error.stack && (
          <div className="bg-muted max-h-40 overflow-auto rounded-lg p-4 text-left">
            <pre className="text-muted-foreground font-mono text-[10px] italic">
              {error.stack}
            </pre>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="border-border text-muted-foreground hover:bg-muted flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all active:scale-95"
          >
            <RefreshCcw size={16} />
            Retry
          </button>
          <a
            href="/"
            className="bg-primary text-primary-foreground shadow-primary/10 hover:bg-primary/90 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-lg transition-all active:scale-95"
          >
            <Home size={16} />
            Home
          </a>
        </div>
      </div>
    </div>
  )
}
