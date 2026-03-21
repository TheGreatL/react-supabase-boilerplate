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
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <LoginForm />
      </div>

      {/* Right Side: Decorative Panel (Premium Look) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-indigo-600">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-indigo-500 to-purple-600" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="w-full max-w-md space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Now smarter & faster
            </div>

            <h2 className="text-4xl font-bold tracking-tight animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
              Build your next big idea with our powerful platform.
            </h2>

            <p className="text-lg text-indigo-100 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
              Experience the masterclass of backend and frontend engineering.
              Secure, scalable, and stunningly designed.
            </p>

            <div className="pt-8 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-indigo-200">
                  Uptime Reliability
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold">256-bit</div>
                <div className="text-sm text-indigo-200">AES Encryption</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>
    </div>
  )
}
