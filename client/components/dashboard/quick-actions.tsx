import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Terminal, MessageSquare, GitBranch, ArrowRight } from "lucide-react"

interface QuickAction {
  icon: React.ReactNode
  title: string
  description: string
}

const quickActionsData: QuickAction[] = [
  {
    icon: <Terminal className="w-5 h-5 text-primary" />,
    title: "New Project",
    description: "Create a new coding project"
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-primary" />,
    title: "Chat with AI",
    description: "Get help with your code"
  },
  {
    icon: <GitBranch className="w-5 h-5 text-primary" />,
    title: "Git Operations",
    description: "Manage your repositories"
  }
]

function QuickActionButton({ icon, title, description }: QuickAction) {
  return (
    <Button variant="outline" className="w-full justify-start h-auto py-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-primary/10">
          {icon}
        </div>
        <div className="text-left">
          <div className="font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
        <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
      </div>
    </Button>
  )
}

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Get started with your most common tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActionsData.map((action, index) => (
          <QuickActionButton key={index} {...action} />
        ))}
      </CardContent>
    </Card>
  )
}