import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react'

import TanStackQueryProvider from '../shared/integrations/tanstack-query/root-provider'
import TanStackQueryDevtools from '../shared/integrations/tanstack-query/devtools'

import appCss from '../shared/styles/global.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/shared/components/ui/sonner'

import { useAuthStore } from '../shared/stores/auth.store'
import { useEffect } from 'react'

interface TMyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRouteWithContext<TMyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Boilerplate System',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  errorComponent: ErrorComponent,
  pendingComponent: PendingComponent,
  notFoundComponent: () => <NotFoundComponent />,
})

function NotFoundComponent() {
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

function PendingComponent() {
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

function ErrorComponent({ error }: { error: Error }) {
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

function RootDocument({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="antialiased wrap-anywhere ">
        <TanStackQueryProvider>
          {/* <Header /> */}
          <Toaster richColors />
          {children}
          {/* <Footer /> */}
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </TanStackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}
