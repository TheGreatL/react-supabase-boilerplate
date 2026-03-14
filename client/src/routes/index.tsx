import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
  notFoundComponent: () => <p>Not Found</p>,
})

function App() {
  return <Navigate to="/login" />
}
