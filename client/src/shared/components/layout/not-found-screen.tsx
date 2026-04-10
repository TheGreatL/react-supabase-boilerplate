import { AlertTriangle, Home } from 'lucide-react'

export function NotFoundScreen() {
  return (
    <div className="animate-in fade-in zoom-in-95 flex min-h-[70vh] flex-col items-center justify-center p-6 text-center duration-500">
      <div className="space-y-6">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <AlertTriangle size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            404
          </h1>
          <h2 className="text-xl font-semibold text-muted-foreground">
            Page not found
          </h2>
          <p className="mx-auto max-w-xs text-muted-foreground/80">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved or deleted.
          </p>
        </div>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:bg-primary/90 active:scale-95"
        >
          <Home size={18} />
          Back to Home
        </a>
      </div>
    </div>
  )
}
