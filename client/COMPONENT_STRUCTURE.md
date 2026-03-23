# 组件架构文档

## 概述

根据 Vercel React 最佳实践，我们将首页拆分为多个独立的、可复用的组件。这种架构提高了代码的可维护性、可测试性和性能。

## 组件结构

```
components/dashboard/
├── index.ts              # 组件导出索引
├── header.tsx            # 顶部导航栏
├── stats-cards.tsx       # 统计卡片
├── quick-actions.tsx     # 快速操作面板
├── recent-activity.tsx   # 最近活动
├── ai-capabilities.tsx   # AI 能力展示
└── footer.tsx            # 页脚
```

## 组件说明

### 1. DashboardHeader (`header.tsx`)

**职责**: 显示应用 Logo、用户信息和退出按钮

**Props**:
```typescript
interface DashboardHeaderProps {
  userName?: string
  userEmail?: string
  userImage?: string | null
}
```

**特性**:
- 响应式设计（移动端隐藏用户详细信息）
- 粘性定位（sticky）
- 毛玻璃效果（backdrop-blur）

### 2. StatsCards (`stats-cards.tsx`)

**职责**: 显示用户统计数据

**数据结构**:
```typescript
interface StatCard {
  title: string
  value: string
  icon: React.ReactNode
}
```

**特性**:
- 数据驱动渲染
- 悬停效果
- 响应式网格布局

### 3. QuickActions (`quick-actions.tsx`)

**职责**: 提供常用操作的快捷入口

**数据结构**:
```typescript
interface QuickAction {
  icon: React.ReactNode
  title: string
  description: string
}
```

**特性**:
- 统一的按钮样式
- 图标 + 文字描述
- 箭头指示器

### 4. RecentActivity (`recent-activity.tsx`)

**职责**: 显示用户最近的编码活动

**数据结构**:
```typescript
interface Activity {
  icon: React.ReactNode
  title: string
  description: string
  time: string
}
```

**特性**:
- 时间线布局
- 时间标签
- 分隔符

### 5. AICapabilities (`ai-capabilities.tsx`)

**职责**: 展示 AI 功能能力

**数据结构**:
```typescript
interface Capability {
  icon: React.ReactNode
  title: string
  description: string
}
```

**特性**:
- 网格布局
- 悬停效果
- 图标 + 标题 + 描述

### 6. DashboardFooter (`footer.tsx`)

**职责**: 显示版权信息

**特性**:
- 简洁设计
- 居中对齐

## 使用方式

### 方式 1: 直接导入（推荐）

```tsx
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
// ...
```

### 方式 2: 使用索引文件

```tsx
import { 
  DashboardHeader, 
  StatsCards, 
  QuickActions,
  RecentActivity,
  AICapabilities,
  DashboardFooter
} from "@/components/dashboard"
```

## Vercel 最佳实践应用

### 1. 组件拆分 (rerender-no-inline-components)
- ✅ 避免在组件内部定义子组件
- ✅ 每个组件职责单一

### 2. 静态 JSX 提取 (rerender-hoist-jsx)
- ✅ 将静态 JSX 提取到组件外部
- ✅ 减少不必要的重新渲染

### 3. 数据驱动渲染
- ✅ 使用数组数据驱动组件渲染
- ✅ 便于维护和扩展

### 4. Props 优化
- ✅ 使用明确的 TypeScript 接口
- ✅ 提供默认值和可选属性

### 5. 性能优化
- ✅ 组件按需加载
- ✅ 避免不必要的重新渲染
- ✅ 使用 React.memo（在需要时）

## 扩展指南

### 添加新的统计卡片

编辑 `components/dashboard/stats-cards.tsx`:

```typescript
const statsData: StatCard[] = [
  // 现有数据...
  {
    title: "New Metric",
    value: "100",
    icon: <YourIcon className="w-8 h-8 text-primary/20" />
  }
]
```

### 添加新的快速操作

编辑 `components/dashboard/quick-actions.tsx`:

```typescript
const quickActionsData: QuickAction[] = [
  // 现有数据...
  {
    icon: <YourIcon className="w-5 h-5 text-primary" />,
    title: "New Action",
    description: "Action description"
  }
]
```

### 添加新的活动记录

编辑 `components/dashboard/recent-activity.tsx`:

```typescript
const activitiesData: Activity[] = [
  // 现有数据...
  {
    icon: <YourIcon className="w-4 h-4 text-primary" />,
    title: "New Activity",
    description: "Activity description",
    time: "Just now"
  }
]
```

### 添加新的 AI 能力

编辑 `components/dashboard/ai-capabilities.tsx`:

```typescript
const capabilitiesData: Capability[] = [
  // 现有数据...
  {
    icon: <YourIcon className="w-5 h-5 text-primary" />,
    title: "New Capability",
    description: "Capability description"
  }
]
```

## 测试建议

每个组件都应该有独立的单元测试：

```typescript
// components/dashboard/__tests__/header.test.tsx
import { render, screen } from '@testing-library/react'
import { DashboardHeader } from '../header'

describe('DashboardHeader', () => {
  it('renders user information', () => {
    render(
      <DashboardHeader 
        userName="Test User"
        userEmail="test@example.com"
      />
    )
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })
})
```

## 性能监控

建议使用以下工具监控组件性能：

1. **React DevTools Profiler**: 分析组件渲染性能
2. **Lighthouse**: 评估整体页面性能
3. **Bundle Analyzer**: 检查打包大小

## 未来优化方向

1. **动态导入**: 对大型组件使用 `next/dynamic`
2. **虚拟滚动**: 对长列表使用虚拟滚动
3. **图片优化**: 使用 Next.js Image 组件
4. **代码分割**: 进一步拆分大型组件
5. **服务端组件**: 将合适的组件转换为服务端组件

## 相关文档

- [Vercel React Best Practices](https://vercel.com/guides/react-best-practices)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)