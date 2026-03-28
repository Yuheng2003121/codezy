import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";

/**
 * 认证状态Hook
 * 用于检查用户是否已登录，如果未登录则重定向到登录页
 */
export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      if (!data?.session && !data?.user) {
        // 用户未登录，重定向到登录页，并附带当前路径作为 redirectTo 参数
        router.push(`/sign-in?redirectTo=${encodeURIComponent(pathname)}`);
      } else if (
        (pathname === "/sign-in" || pathname === "/sign-up") &&
        data?.session &&
        data?.user
      ) {
        // 用户已登录但访问了登录/注册页面，重定向到 redirectTo 参数指定的页面或首页
        const redirectTo = searchParams.get("redirectTo");
        router.push(redirectTo || "/");
      }
    }
  }, [data, isPending, router, pathname, searchParams]);

  return {
    user: data?.user,
    session: data?.session,
    isPending,
    isAuthenticated: !!data?.session && !!data?.user,
  };
}

/**
 * 认证保护组件Props
 */
interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 认证保护组件
 * 如果用户未登录，显示加载状态或重定向到登录页
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isPending, isAuthenticated } = useAuth();

  if (isPending) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center h-screen">
          <Spinner />
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null; // useAuth hook会处理重定向
  }

  return <>{children}</>;
}
