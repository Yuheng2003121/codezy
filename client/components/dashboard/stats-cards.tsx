import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCode, Code2, MessageSquare, Zap } from "lucide-react"

interface StatCard {
  title: string
  value: string
  icon: React.ReactNode
}

const statsData: StatCard[] = [
  {
    title: "Total Projects",
    value: "12",
    icon: <FileCode className="w-8 h-8 text-primary/20" />
  },
  {
    title: "Code Generated",
    value: "2.4k",
    icon: <Code2 className="w-8 h-8 text-primary/20" />
  },
  {
    title: "AI Interactions",
    value: "156",
    icon: <MessageSquare className="w-8 h-8 text-primary/20" />
  },
  {
    title: "Time Saved",
    value: "48h",
    icon: <Zap className="w-8 h-8 text-primary/20" />
  }
]

function StatCard({ title, value, icon }: StatCard) {
  return (
    <Card className="border-2 hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{value}</div>
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}