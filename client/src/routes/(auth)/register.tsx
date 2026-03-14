import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/register')({
  component: RegisterComponent,
})

function RegisterComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Register Page</h1>
        <p className="text-muted-foreground">Work in progress...</p>
      </div>
    </div>
  )
}
