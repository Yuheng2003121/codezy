# 认证拦截器使用指南

## 概述

`hooks/use-auth.tsx` 提供了两个主要的工具来处理认证检查：

1. **`useAuth` Hook** - 用于在组件内部检查认证状态
2. **`AuthGuard` 组件** - 用于保护需要认证的页面

## 使用方法

### 1. 使用 `useAuth` Hook

在需要访问用户信息的组件中使用：

```tsx
"use client"

import { useAuth } from "@/hooks/use-auth"

export default function MyComponent() {
  const { user, session, isPending, isAuthenticated } = useAuth()

  if (isPending) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    // useAuth 会自动重定向到登录页
    return null
  }

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <p>Email: {user?.email}</p>
    </div>
  )
}
```

### 2. 使用 `AuthGuard` 组件

保护整个页面或组件树：

```tsx
"use client"

import { AuthGuard } from "@/hooks/use-auth"

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>
        <h1>这个页面需要登录才能访问</h1>
        {/* 页面内容 */}
      </div>
    </AuthGuard>
  )
}
```

### 3. 自定义加载状态

```tsx
<AuthGuard fallback={<CustomLoadingSpinner />}>
  <YourComponent />
</AuthGuard>
```

## API 参考

### `useAuth` Hook

返回值：
- `user`: 用户对象（包含 name, email, image 等）
- `session`: 会话对象
- `isPending`: 是否正在加载
- `isAuthenticated`: 用户是否已认证

### `AuthGuard` 组件

Props：
- `children`: React.ReactNode - 要保护的子组件
- `fallback`: React.ReactNode (可选) - 自定义加载状态

## 示例：在首页中使用

```tsx
"use client"

import { AuthGuard } from "@/hooks/use-auth"
import { authClient } from "@/lib/auth-client"

export default function Home() {
  const { data } = authClient.useSession()
  const user = data?.user

  return (
    <AuthGuard>
      <div>
        <h1>Welcome, {user?.name}!</h1>
        {/* 页面内容 */}
      </div>
    </AuthGuard>
  )
}
```

## 注意事项

1. `useAuth` Hook 会在未认证时自动重定向到 `/sign-in`
2. `AuthGuard` 组件会显示加载状态，直到认证检查完成
3. 两个工具都使用 `authClient.useSession()` 来获取认证状态
4. 确保在客户端组件中使用（添加 `"use client"` 指令）

## 迁移指南

如果你之前在每个页面中手动检查认证状态：

**之前：**
```tsx
const {data, isPending} = authClient.useSession();

if (isPending) {
  return <Spinner/>
}

if (!data?.session && !data?.user) {
  router.push("/sign-in")
}
```

**现在：**
```tsx
import { AuthGuard } from "@/hooks/use-auth"

// 使用 AuthGuard 包裹整个组件
<AuthGuard>
  {/* 你的内容 */}
</AuthGuard>
```

或者使用 `useAuth` Hook：
```tsx
import { useAuth } from "@/hooks/use-auth"

const { user, isPending, isAuthenticated } = useAuth()

if (isPending) {
  return <Spinner/>
}

// useAuth 会自动处理重定向