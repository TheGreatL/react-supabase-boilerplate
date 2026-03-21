import * as React from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Input } from './input'

/**
 * Gold Standard:
 * A reusable PasswordInput component that wraps the base Input component
 * and adds a toggle visibility button.
 */
function PasswordInput({ className, ...props }: React.ComponentProps<'input'>) {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="group/password relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-10', className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="text-muted-foreground/50 hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-3 -translate-y-1/2 rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <EyeOffIcon className="size-4" strokeWidth={2} />
        ) : (
          <EyeIcon className="size-4" strokeWidth={2} />
        )}
      </button>
    </div>
  )
}

export { PasswordInput }
