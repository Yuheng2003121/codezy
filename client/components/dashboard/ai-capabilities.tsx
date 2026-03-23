import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Code2, MessageSquare, Terminal, FileCode, GitBranch, Lock } from "lucide-react"

interface Capability {
  icon: React.ReactNode
  title: string
  description: string
}

const capabilitiesData: Capability[] = [
  {
    icon: <Code2 className="w-5 h-5 text-primary" />,
    title: "Code Generation",
    description: "Generate production-ready code from natural language descriptions"
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-primary" />,
    title: "Code Review",
    description: "Get intelligent feedback and suggestions for your code"
  },
  {
    icon: <Terminal className="w-5 h-5 text-primary" />,
    title: "Debug Assistant",
    description: "Identify and fix bugs with AI-powered debugging"
  },
  {
    icon: <FileCode className="w-5 h-5 text-primary" />,
    title: "Documentation",
    description: "Auto-generate comprehensive documentation for your code"
  },
  {
    icon: <GitBranch className="w-5 h-5 text-primary" />,
    title: "Refactoring",
    description: "Improve code quality and maintainability with smart refactoring"
  },
  {
    icon: <Lock className="w-5 h-5 text-primary" />,
    title: "Security Analysis",
    description: "Detect vulnerabilities and security issues in your code"
  }
]

function CapabilityCard({ icon, title, description }: Capability) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="p-2 rounded-md bg-primary/10">
        {icon}
      </div>
      <div>
        <h4 className="font-medium mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}

export function AICapabilities() {
  return (
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
          {capabilitiesData.map((capability, index) => (
            <CapabilityCard key={index} {...capability} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}