import { AlertTriangle, Home } from 'lucide-react'

export function NotFoundScreen() {
  return (
    <div className="animate-in fade-in zoom-in-95 flex min-h-[70vh] flex-col items-center justify-center p-6 text-center duration-500">
      <div className="space-y-6">
        <div className="bg-muted text-muted-foreground inline-flex h-24 w-24 items-center justify-center rounded-full">
          <AlertTriangle size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-foreground text-4xl font-bold">404</h1>
          <h2 className="text-muted-foreground text-xl font-semibold">
            Page not found
          </h2>
          <p className="text-muted-foreground/80 mx-auto max-w-xs">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved or deleted.
          </p>
        </div>
        <a
          href="/"
          className="bg-primary text-primary-foreground shadow-primary/10 hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition-all active:scale-95"
        >
          <Home size={18} />
          Back to Home
        </a>
      </div>
    </div>
  )
}
