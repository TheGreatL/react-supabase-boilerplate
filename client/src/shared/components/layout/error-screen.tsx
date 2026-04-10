import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

interface ErrorScreenProps {
  error: Error
}

export function ErrorScreen({ error }: ErrorScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="animate-in fade-in zoom-in-95 w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 text-center shadow-xl duration-500">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4 text-destructive">
            <AlertTriangle size={48} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Oops! Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground">
            {error.message ||
              'An unexpected error occurred. Please try again later.'}
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && error.stack && (
          <div className="max-h-40 overflow-auto rounded-lg bg-muted p-4 text-left">
            <pre className="font-mono text-[10px] text-muted-foreground italic">
              {error.stack}
            </pre>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-muted active:scale-95"
          >
            <RefreshCcw size={16} />
            Retry
          </button>
          <a
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:bg-primary/90 active:scale-95"
          >
            <Home size={16} />
            Home
          </a>
        </div>
      </div>
    </div>
  )
}
