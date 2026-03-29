"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Key, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Logo from "@/components/ui/logo"

export default function DeviceAuthorizationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [userCode, setUserCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Extract user_code from query params on mount
  useEffect(() => {
    const code = searchParams.get("user_code")
    if (code) {
      setUserCode(code.toUpperCase())
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formattedCode = userCode.trim().replace(/-/g, "").toUpperCase();
      
      const response = await authClient.device({
        query: {
          user_code: formattedCode,
        },
      });
      console.log(response);
      

      if (response.data) {
        router.push(`/approve?user_code=${formattedCode}`)
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary text-primary-foreground mb-4 mx-auto">
            <Logo/>
          </div>
          <h1 className="text-3xl font-bold mb-2">Device Authorization</h1>
          <p className="text-muted-foreground">
            Enter your user code to authorize device access
          </p>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Key className="w-5 h-5 text-primary" />
              Enter User Code
            </CardTitle>
            <CardDescription>
              The user code displayed in your terminal is used to verify device identity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userCode" className="text-sm font-medium">
                  User Code
                </Label>
                <Input
                  id="userCode"
                  type="text"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value.toUpperCase())}
                  placeholder="XXXX-XXXX"
                  maxLength={9}
                  className="text-center text-2xl font-mono tracking-widest h-14"
                  disabled={isLoading || success}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Please enter 8-character code in format XXXX-XXXX
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="border-destructive/50">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <AlertDescription className="text-green-600 dark:text-green-400">
                    Authorization successful! Redirecting...
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={isLoading || success || userCode.length < 8}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Authorized
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Need help?</span>
                <Badge variant="outline" className="font-mono">
                  CLI v1.0
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          This page is used for OAuth 2.0 Device Flow authorization
        </p>
      </div>
    </div>
  )
}
