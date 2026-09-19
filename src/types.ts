export type PageKey = 'dashboard' | 'clients' | 'followup' | 'risk' | 'reports'

export type RiskLevel = '高风险' | '需关注' | '服务机会'

export type RiskCategory = '投资组合风险' | '流动性风险' | '目标偏离' | '客户流失风险'

export type RiskPriority = '高' | '中' | '低'

export type DeliverableType = '建议' | '提纲' | '报告' | '纪要'

export interface ClientAction {
  id: string
  name: string
  initials: string
  level: RiskLevel
  priority: number
  aum: string
  profile: string
  event: string
  evidence: string
  due: string
  source: string
  accent: string
}

export interface RiskAlert {
  id: string
  customer: string
  category: RiskCategory
  categoryEn: string
  priority: RiskPriority
  score: number
  impactValue: string
  impactLabel: string
  summary: string
  urgency: string
  accent: string
}

export type ClientDirectoryStatus = '风险关注' | '正常服务' | '需跟进'

export interface WealthClient {
  id: string
  name: string
  initials: string
  clientNo: string
  aum: string
  walletShare: number
  status: ClientDirectoryStatus
  segment: '高净值客户' | '富裕客户' | '成长客户' | '私行客户'
  recentContact: string
  nextAction: string
  favorite: boolean
  isMine: boolean
  accent: string
}

export interface Deliverable {
  key: DeliverableType
  title: string
  subtitle: string
  prompt: string
}

export interface ChatMessage {
  id: number
  role: 'assistant' | 'user'
  content: string
}
