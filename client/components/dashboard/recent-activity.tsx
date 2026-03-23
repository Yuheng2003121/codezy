import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Code2, Database, Globe } from "lucide-react"

interface Activity {
  icon: React.ReactNode
  title: string
  description: string
  time: string
}

const activitiesData: Activity[] = [
  {
    icon: <Code2 className="w-4 h-4 text-primary" />,
    title: "React Component Refactor",
    description: "Refactored authentication flow with better error handling",
    time: "2h ago"
  },
  {
    icon: <Database className="w-4 h-4 text-primary" />,
    title: "Database Schema Update",
    description: "Added user preferences and settings tables",
    time: "5h ago"
  },
  {
    icon: <Globe className="w-4 h-4 text-primary" />,
    title: "API Integration",
    description: "Connected to external payment gateway service",
    time: "1d ago"
  }
]

function ActivityItem({ icon, title, description, time }: Activity) {
  return (
    <>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-primary/10 mt-1">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-medium">{title}</p>
            <Badge variant="secondary" className="text-xs">{time}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        </div>
      </div>
      <Separator />
    </>
  )
}

export function RecentActivity() {
  return (
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
        {activitiesData.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </CardContent>
    </Card>
  )
}