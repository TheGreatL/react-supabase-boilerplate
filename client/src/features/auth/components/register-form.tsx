import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  Loader2,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircleIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { registerSchema } from '../auth.schema'
import type { TRegister } from '../auth.schema'
import { authService } from '../auth.service'
import { useAuthStore } from '../../../shared/stores/auth.store'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shared/components/ui/alert'
import { Input } from '@/shared/components/ui/input'
import { PasswordInput } from '@/shared/components/ui/password-input'

export default function RegisterForm() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegister>({
    resolver: zodResolver(registerSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: TRegister) => authService.register(data),
    onSuccess: async (response) => {
      setAuth(response.data.user, response.data.accessToken)
      await useAuthStore.getState().getMe()

      toast.success('Account created successfully!', {
        description: 'Welcome to our platform. Redirecting to dashboard...',
      })

      setTimeout(() => {
        navigate({ to: '/dashboard' })
      }, 1000)
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.'
      toast.error(message)
    },
  })

  const onSubmit = (data: TRegister) => {
    mutation.mutate(data)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 w-full max-w-md space-y-8 duration-700">
      <div className="space-y-2 text-center">
        <h1 className="bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          Create an Account
        </h1>
        <p className="text-muted-foreground">
          Enter your details to create your account
        </p>
      </div>

      {mutation.isError && (
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Registration failed</AlertTitle>
          <AlertDescription>
            {(
              mutation.error as Error & {
                response?: { data?: { message?: string } }
              }
            ).response?.data?.message ||
              'Something went wrong. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </label>
            <div className="relative">
              <User className="text-muted-foreground absolute top-3 left-3 z-10 h-4 w-4" />
              <Input
                {...register('firstName')}
                id="firstName"
                placeholder="John"
                className="pl-9"
              />
            </div>
            {errors.firstName && (
              <p className="text-destructive text-xs font-medium">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </label>
            <div className="relative">
              <User className="text-muted-foreground absolute top-3 left-3 z-10 h-4 w-4" />
              <Input
                {...register('lastName')}
                id="lastName"
                placeholder="Doe"
                className="pl-9"
              />
            </div>
            {errors.lastName && (
              <p className="text-destructive text-xs font-medium">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
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
            <p className="text-destructive text-xs font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
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
            <p className="text-destructive text-xs font-medium">
              {errors.password.message}
            </p>
          )}
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
              Create Account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Already have an account?{' '}
          <button
            onClick={() => navigate({ to: '/login' })}
            className="font-medium text-indigo-500 transition-colors hover:text-indigo-600"
          >
            Sign in instead
          </button>
        </p>
      </div>
    </div>
  )
}
