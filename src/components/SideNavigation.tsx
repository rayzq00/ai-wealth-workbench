import type { ReactNode } from 'react'
import {
  AppstoreOutlined,
  BellOutlined,
  LeftOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Tooltip } from 'antd'
import wealthLogo from '../../asset/logo.svg'
import type { PageKey } from '../types'

interface SideNavigationProps {
  collapsed: boolean
  activePage: PageKey
  onCollapse: () => void
  onNavigate: (page: PageKey) => void
}

interface NavItem {
  key: PageKey
  label: string
  icon: ReactNode
}

const mainItems: NavItem[] = [
  { key: 'dashboard', label: 'AI 财富管理工作台', icon: <AppstoreOutlined /> },
  { key: 'clients', label: '客户中心', icon: <TeamOutlined /> },
]

export function SideNavigation({
  collapsed,
  activePage,
  onCollapse,
  onNavigate,
}: SideNavigationProps) {
  return (
    <>
      <aside className={`app-sidebar ${collapsed ? 'is-collapsed' : ''}`}>
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true"><img src={wealthLogo} alt="" /></div>
          {!collapsed && (
            <div className="brand-copy">
              <span className="brand-title">曜见财富</span>
            </div>
          )}
        </div>

        <nav className="side-nav" aria-label="主导航">
          {mainItems.map((item) => (
            <Tooltip key={item.key} title={collapsed ? item.label : undefined} placement="right">
              <button
                type="button"
                aria-label={item.label}
                aria-current={activePage === item.key ? 'page' : undefined}
                className={`nav-item ${activePage === item.key ? 'is-active' : ''}`}
                onClick={() => onNavigate(item.key)}
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </button>
            </Tooltip>
          ))}
        </nav>

        <div className="sidebar-user">
          <Avatar className="advisor-avatar">顾</Avatar>
          {!collapsed && (
            <>
              <div className="advisor-copy">
                <strong>顾明远</strong>
                <span>财富顾问 · 上海一部</span>
              </div>
              <Button type="text" className="sidebar-notice" icon={<BellOutlined />} aria-label="通知" />
            </>
          )}
        </div>
      </aside>

      <button
        type="button"
        className={`collapse-trigger ${collapsed ? 'is-collapsed' : ''}`}
        onClick={onCollapse}
        aria-label={collapsed ? '展开侧边栏' : '收起侧边栏'}
      >
        <LeftOutlined />
      </button>
    </>
  )
}
