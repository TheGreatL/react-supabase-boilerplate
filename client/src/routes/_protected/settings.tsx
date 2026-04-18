import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/shared/stores/auth.store'
import { userService } from '@/shared/api/user.service'
import QUERY_KEYS from '@/shared/constants/query-keys'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'
import { Camera, Loader2, User as UserIcon } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_protected/settings')({
  component: SettingsComponent,
})

function AvatarUpload() {
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  // Use TanStack Query for the mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => userService.updateAvatar(file),
    onSuccess: (updatedUser) => {
      // 1. Update the global Auth state
      updateUser(updatedUser)

      // 2. Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.users] })

      toast.success('Avatar updated successfully')
    },
    onError: (error: Error) => {
      console.error('Failed to upload avatar:', error)
      toast.error('Failed to upload avatar')
    },
  })

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Simple validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    uploadAvatarMutation.mutate(file)
  }

  const triggerUpload = () => {
    fileInputRef.current?.click()
  }

  // Backend now handles full URL resolution, simplification here:
  const avatarUrl = user?.profilePhoto || undefined

  return (
    <div className="flex items-center gap-6">
      <div className="group relative cursor-pointer" onClick={triggerUpload}>
        <Avatar className="border-border group-hover:border-primary/50 h-24 w-24 border-2 shadow-sm transition-all">
          <AvatarImage
            src={avatarUrl}
            alt={user?.firstName}
            className="object-cover"
          />
          <AvatarFallback className="bg-muted text-muted-foreground text-xl">
            <UserIcon className="h-10 w-10 opacity-50" />
          </AvatarFallback>
        </Avatar>

        {/* Overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          {uploadAvatarMutation.isPending ? (
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          ) : (
            <Camera className="h-8 w-8 text-white" />
          )}
        </div>

        {/* Hidden input */}
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          aria-label="Upload profile picture"
        />
      </div>

      <div className="space-y-1">
        <h3 className="text-foreground text-lg font-medium">Profile Image</h3>
        <p className="text-muted-foreground text-sm">
          Click the avatar to upload a new photo.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={triggerUpload}
          disabled={uploadAvatarMutation.isPending}
        >
          {uploadAvatarMutation.isPending ? 'Uploading...' : 'Change Photo'}
        </Button>
      </div>
    </div>
  )
}

function SettingsComponent() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="animate-in fade-in slide-in-from-top-4 container mx-auto px-4 py-8 duration-500">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and profile preferences.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">
                Profile Information
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Update your personal details here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Added Avatar Upload Section */}
              <AvatarUpload />

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    defaultValue={user?.firstName}
                    className="border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    defaultValue={user?.lastName}
                    className="border-border text-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  defaultValue={user?.email}
                  disabled
                  className="border-border bg-muted cursor-not-allowed"
                />
                <p className="text-muted-foreground text-xs">
                  Email cannot be changed currently.
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-border bg-muted/30 flex justify-end border-t p-4">
              <Button onClick={() => alert('Profile update coming soon!')}>
                Save Changes
              </Button>
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
