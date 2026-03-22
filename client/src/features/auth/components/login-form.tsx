import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, Mail, Lock, ArrowRight, AlertCircleIcon } from 'lucide-react'
import { toast } from 'sonner'
import { loginSchema } from '../auth.schema'
import type { TLogin } from '../auth.schema'
import { authService } from '../auth.service'
import { useAuthStore } from '../../../shared/stores/auth.store'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shared/components/ui/alert'
import { Input } from '@/shared/components/ui/input'
import { PasswordInput } from '@/shared/components/ui/password-input'

export default function LoginForm() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: TLogin) => authService.login(data),
    onSuccess: async (response) => {
      // 1. Set basic auth data
      setAuth(response.data.user, response.data.accessToken)

      // 2. Fetch full profile via /me
      await useAuthStore.getState().getMe()

      toast.success(
        `Welcome back, ${useAuthStore.getState().user?.firstName || 'User'}!`,
        {
          description: 'Successfully logged in. Redirecting to dashboard...',
        },
      )

      setTimeout(() => {
        navigate({ to: '/dashboard' })
      }, 1000)
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      console.error('Login error full:', error)
      const message =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please check your credentials.'
      toast.error(message)
    },
  })

  const onSubmit = (data: TLogin) => {
    mutation.mutate(data)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 w-full max-w-md space-y-8 duration-700">
      <div className="space-y-2 text-center">
        <h1 className="bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          Welcome Back
        </h1>
        <p className="text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      {mutation.isError && (
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Failed to login</AlertTitle>
          <AlertDescription>
            {(
              mutation.error as Error & {
                response?: { data?: { message?: string } }
              }
            ).response?.data?.message || 'Invalid credentials'}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-3 left-3 z-10 h-4 w-4" />
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-9"
              />
            </div>
            {errors.email && (
              <p className="text-destructive animate-in fade-in zoom-in-95 text-xs font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password
              </label>
              <a
                href="#"
                className="text-xs text-indigo-500 transition-colors hover:text-indigo-600"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="text-muted-foreground absolute top-3 left-3 z-10 h-4 w-4" />
              <PasswordInput
                {...register('password')}
                id="password"
                placeholder="••••••••"
                className="pl-9"
              />
            </div>
            {errors.password && (
              <p className="text-destructive animate-in fade-in zoom-in-95 text-xs font-medium">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <button
          disabled={mutation.isPending}
          type="submit"
          className="relative flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-70"
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => navigate({ to: '/register' })}
            className="font-medium text-indigo-500 transition-colors hover:text-indigo-600"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  )
}
