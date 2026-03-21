import LoginForm from '@/features/auth/components/login-form'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

const loginSearchSchema = z.object({
  reason: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/login')({
  validateSearch: loginSearchSchema,
  component: LoginComponent,
})

function LoginComponent() {
  const { reason } = Route.useSearch()
  const hasShownToast = useRef(false)

  useEffect(() => {
    if (reason === 'expired' && !hasShownToast.current) {
      toast.error('Your session has expired. Please log in again.', {
        id: 'session-expired-toast',
      })
      hasShownToast.current = true
    }
  }, [reason])

  return (
    <div className="flex min-h-screen">
      {/* Left Side: Form */}
      <div className="flex flex-1 items-center justify-center bg-white p-8">
        <LoginForm />
      </div>

      {/* Right Side: Decorative Panel (Premium Look) */}
      <div className="relative hidden flex-1 overflow-hidden bg-indigo-600 lg:flex">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-indigo-500 to-purple-600" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />

        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="w-full max-w-md space-y-6">
            <div className="animate-in fade-in slide-in-from-top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-md duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
              Now smarter & faster
            </div>

            <h2 className="animate-in fade-in slide-in-from-left-4 text-4xl font-bold tracking-tight delay-200 duration-700">
              Build your next big idea with our powerful platform.
            </h2>

            <p className="animate-in fade-in slide-in-from-left-4 text-lg text-indigo-100 delay-300 duration-700">
              Experience the masterclass of backend and frontend engineering.
              Secure, scalable, and stunningly designed.
            </p>

            <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-2 gap-4 pt-8 delay-500 duration-1000">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-indigo-200">
                  Uptime Reliability
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">256-bit</div>
                <div className="text-sm text-indigo-200">AES Encryption</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>
    </div>
  )
}
