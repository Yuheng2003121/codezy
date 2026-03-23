import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Terminal, LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

interface DashboardHeaderProps {
  userName?: string
  userEmail?: string
  userImage?: string | null
}

export function DashboardHeader({ userName, userEmail, userImage }: DashboardHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        }
      }
    })
  }

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Coder CLI</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Development</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={userImage || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {userName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">{userName || "User"}</p>
              <p className="text-xs text-muted-foreground">{userEmail || ""}</p>
            </div>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}