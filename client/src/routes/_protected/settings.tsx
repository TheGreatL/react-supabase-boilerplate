import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import { Button } from '@/shared/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'

export const Route = createFileRoute('/_protected/settings')({
  component: SettingsComponent,
})

function SettingsComponent() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="animate-in fade-in slide-in-from-top-4 py-8 duration-500 container mx-auto px-4">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account and profile preferences.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Profile Information</CardTitle>
              <CardDescription className="text-muted-foreground">
                Update your personal details here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                  <Input id="firstName" defaultValue={user?.firstName} className="border-border text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                  <Input id="lastName" defaultValue={user?.lastName} className="border-border text-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email Address</Label>
                <Input id="email" defaultValue={user?.email} disabled className="border-border bg-muted cursor-not-allowed" />
                <p className="text-xs text-muted-foreground">Email cannot be changed currently.</p>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border bg-muted/30 flex justify-end p-4">
              <Button onClick={() => alert('Profile update coming soon!')}>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription className="text-destructive/80">
                Once you delete your account, there is no going back.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
