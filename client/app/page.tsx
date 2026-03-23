"use client"

import { AuthGuard } from "@/hooks/use-auth"
import { authClient } from "@/lib/auth-client"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { AICapabilities } from "@/components/dashboard/ai-capabilities"
import { DashboardFooter } from "@/components/dashboard/footer"
import { Sparkles } from "lucide-react"

// 静态 JSX 提取到组件外部 (rerender-hoist-jsx)
const welcomeSection = (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-2">
      <Sparkles className="w-5 h-5 text-primary" />
      <h2 className="text-2xl font-bold">Welcome back!</h2>
    </div>
    <p className="text-muted-foreground">
      Your AI-powered coding companion is ready to help you build amazing things.
    </p>
  </div>
)

export default function Home() {
  const { data } = authClient.useSession()
  const user = data?.user

  return (
    <AuthGuard>
      <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
        <DashboardHeader 
          userName={user?.name}
          userEmail={user?.email}
          userImage={user?.image}
        />
        
        <main className="container mx-auto px-4 py-8">
          {welcomeSection}
          
          <StatsCards/>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 my-6">
            <QuickActions />
            <RecentActivity />
          </div>
          
          <AICapabilities />
        </main>
        
        <DashboardFooter />
      </div>
    </AuthGuard>
  )
}