import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Spinner } from "@/components/ui/spinner"

/**
 * 认证状态Hook
 * 用于检查用户是否已登录，如果未登录则重定向到登录页
 */
export function useAuth() {
  const router = useRouter()
  const { data, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending && !data?.session && !data?.user) {
      router.push("/sign-in")
    }
  }, [data, isPending, router])

  return {
    user: data?.user,
    session: data?.session,
    isPending,
    isAuthenticated: !!data?.session && !!data?.user,
  }
}

/**
 * 认证保护组件Props
 */
interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * 认证保护组件
 * 如果用户未登录，显示加载状态或重定向到登录页
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isPending, isAuthenticated } = useAuth()

  if (isPending) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center h-screen">
          <Spinner />
        </div>
      )
    )
  }

  if (!isAuthenticated) {
    return null // useAuth hook会处理重定向
  }

  return <>{children}</>
}