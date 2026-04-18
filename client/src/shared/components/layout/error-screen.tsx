import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import { Button, buttonVariants } from '../ui/button'
import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'

interface ErrorScreenProps {
  error: Error
}

export function ErrorScreen({ error }: ErrorScreenProps) {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-6">
      <Card className="animate-in fade-in zoom-in-95 border-border bg-card w-full max-w-xl space-y-6 rounded-2xl border p-8 text-center shadow-xl duration-500">
        <CardHeader>
          <CardTitle>Oops! Something went wrong</CardTitle>
          <CardDescription>
            <div className="flex justify-center">
              <div className="bg-destructive/10 text-destructive rounded-full p-4">
                <AlertTriangle size={48} />
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              {error.message ||
                'An unexpected error occurred. Please try again later.'}
            </p>
          </div>

          {process.env.NODE_ENV === 'development' && error.stack && (
            <div className="bg-muted overflow-auto rounded-lg p-4 text-left">
              <pre className="text-muted-foreground font-mono text-sm italic">
                {error.stack}
              </pre>
            </div>
          )}
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-4">
          <Button onClick={() => window.location.reload()} variant={'outline'}>
            <RefreshCcw size={16} />
            Retry
          </Button>
          <Link to="/" className={buttonVariants()}>
            <Home size={16} />
            Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
