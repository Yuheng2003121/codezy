"use client"

import { AuthGuard } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Terminal, 
  Code2, 
  Zap, 
  GitBranch, 
  MessageSquare, 
  Settings, 
  LogOut,
  Sparkles,
  ArrowRight,
  FileCode,
  Database,
  Globe,
  Lock
} from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const { data } = authClient.useSession()
  const user = data?.user

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in")
        }
      }
    })
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
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
                  <AvatarImage src={user?.image || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">Welcome back!</h2>
            </div>
            <p className="text-muted-foreground">
              Your AI-powered coding companion is ready to help you build amazing things.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">12</div>
                  <FileCode className="w-8 h-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Code Generated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">2.4k</div>
                  <Code2 className="w-8 h-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  AI Interactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">156</div>
                  <MessageSquare className="w-8 h-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Time Saved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">48h</div>
                  <Zap className="w-8 h-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Get started with your most common tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Terminal className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">New Project</div>
                      <div className="text-xs text-muted-foreground">Create a new coding project</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                  </div>
                </Button>

                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Chat with AI</div>
                      <div className="text-xs text-muted-foreground">Get help with your code</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                  </div>
                </Button>

                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <GitBranch className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Git Operations</div>
                      <div className="text-xs text-muted-foreground">Manage your repositories</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest coding sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10 mt-1">
                    <Code2 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">React Component Refactor</p>
                      <Badge variant="secondary" className="text-xs">2h ago</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Refactored authentication flow with better error handling
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10 mt-1">
                    <Database className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Database Schema Update</p>
                      <Badge variant="secondary" className="text-xs">5h ago</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Added user preferences and settings tables
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10 mt-1">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">API Integration</p>
                      <Badge variant="secondary" className="text-xs">1d ago</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connected to external payment gateway service
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Capabilities Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Capabilities
              </CardTitle>
              <CardDescription>
                Powered by advanced AI models to accelerate your development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Code2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Code Generation</h4>
                    <p className="text-sm text-muted-foreground">
                      Generate production-ready code from natural language descriptions
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="p-2 rounded-md bg-primary/10">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Code Review</h4>
                    <p className="text-sm text-muted-foreground">
                      Get intelligent feedback and suggestions for your code
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Terminal className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Debug Assistant</h4>
                    <p className="text-sm text-muted-foreground">
                      Identify and fix bugs with AI-powered debugging
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="p-2 rounded-md bg-primary/10">
                    <FileCode className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Documentation</h4>
                    <p className="text-sm text-muted-foreground">
                      Auto-generate comprehensive documentation for your code
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="p-2 rounded-md bg-primary/10">
                    <GitBranch className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Refactoring</h4>
                    <p className="text-sm text-muted-foreground">
                    Improve code quality and maintainability with smart refactoring
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Security Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Detect vulnerabilities and security issues in your code
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="border-t mt-12 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© 2026 Coder CLI. Built with Next.js and AI.</p>
          </div>
        </footer>
      </div>
    </AuthGuard>
  )
}