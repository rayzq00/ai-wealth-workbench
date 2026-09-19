import {
  AuditOutlined,
  ArrowRightOutlined,
  BankOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  TeamOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Tag,
  Tabs,
  Tooltip,
  Typography,
} from 'antd'
import { useMemo, useState } from 'react'
import { AssetDistribution } from '../components/AssetDistribution'
import { CustomerAvatar } from '../components/CustomerAvatar'
import { AssetDonut } from '../components/AssetDonut'
import wealthLogo from '../../asset/logo.svg'
import { followUpItems, riskAlerts, wealthClients } from '../data'
import type { RiskAlert, RiskCategory, RiskPriority } from '../types'

const { Text, Title } = Typography

type RiskFilter = RiskCategory | '全部'

interface DashboardProps {
  onOpenRisk: (risk: RiskAlert) => void
  onToggleAssistant: () => void
  assistantOpen: boolean
}

const priorityMeta: Record<RiskPriority, { color: string; className: string }> = {
  高: { color: 'error', className: 'is-high' },
  中: { color: 'warning', className: 'is-medium' },
  低: { color: 'success', className: 'is-low' },
}

function RiskImpactValue({ value }: { value: string }) {
  const match = value.match(/^([+-]?\d+(?:\.\d+)?)(.*)$/)
  const amount = match?.[1] ?? value
  const unit = match?.[2]?.trim()

  return (
    <div className="risk-impact-value">
      <strong>{amount}</strong>
      {unit && <span className="risk-impact-unit">{unit}</span>}
    </div>
  )
}

const filterOptions: Array<{ label: string; value: RiskFilter }> = [
  { label: '全部', value: '全部' },
  { label: '投资组合', value: '投资组合风险' },
  { label: '流动性', value: '流动性风险' },
  { label: '目标偏离', value: '目标偏离' },
  { label: '客户流失', value: '客户流失风险' },
]

const walletData = [
  { label: '0–25%', clients: 18, width: 29 },
  { label: '26–50%', clients: 31, width: 50 },
  { label: '51–75%', clients: 62, width: 100 },
  { label: '76–100%', clients: 42, width: 68 },
]

export function Dashboard({ onOpenRisk, onToggleAssistant, assistantOpen }: DashboardProps) {
  const [filter, setFilter] = useState<RiskFilter>('全部')
  const [query, setQuery] = useState('')
  const [summaryExpanded, setSummaryExpanded] = useState<'risk' | 'followup' | null>(null)

  const alerts = useMemo(
    () => riskAlerts
      .filter((risk) => filter === '全部' || risk.category === filter)
      .filter((risk) => !query || `${risk.customer}${risk.category}${risk.summary}`.toLowerCase().includes(query.trim().toLowerCase()))
      .sort((a, b) => b.score - a.score),
    [filter, query],
  )

  return (
    <div className="ds-page-shell dashboard-page">
      <div className="ds-page-header dashboard-header">
        <div className="page-title-line">
          <Title level={4} className="ds-page-title">AI 财富管理工作台</Title>
          <Tag className="ai-status-tag" variant="filled">AI 更新于 9-18 09:00</Tag>
        </div>
        <Space className="ds-page-header-extra" size={8}>
          <Tooltip title="更新客户、账户与任务数据">
            <Button icon={<ReloadOutlined />}>刷新数据</Button>
          </Tooltip>
          <Button
            type="primary"
            className="ai-primary-button"
            onClick={onToggleAssistant}
          >
            {assistantOpen ? '关闭 AI 助手' : 'AI 助手'}
          </Button>
        </Space>
      </div>

      <Card variant="borderless" className="ai-brief-card ai-summary-card">
        <div className="ai-summary-heading">
          <span className="ai-summary-mark"><img src={wealthLogo} alt="" /></span>
          <h2>AI智能摘要：共 {riskAlerts.length} 项风险需关注，{followUpItems.length} 项推荐行动，涉及 {riskAlerts.length} 位客户，相关客户在本机构资产合计约 {(wealthClients.filter(client => riskAlerts.some(risk => risk.id === client.id)).reduce((sum, client) => sum + Number.parseFloat(client.aum), 0) / 10000).toFixed(2)} 亿元。</h2>
        </div>
        {/* <p className="ai-summary-overview">AI 检测到：共 {riskAlerts.length} 项风险需关注，{followUpItems.length} 项推荐行动，涉及 {riskAlerts.length} 位客户，相关客户在本机构资产合计约 {(wealthClients.filter(client => riskAlerts.some(risk => risk.id === client.id)).reduce((sum, client) => sum + Number.parseFloat(client.aum), 0) / 10000).toFixed(2)} 亿元。</p> */}
        <div className="ai-summary-lines">
          <div className={summaryExpanded === 'risk' ? 'is-expanded' : ''}>
            <strong>风险项：</strong>
            <span>周启明可能在未来 21 天出现 16.8 万元流动性缺口；林若岚的权益类基金占比高于目标 11 个百分点；刘志远的养老储备进度低于计划；沈嘉成已有 147 天未产生有效互动；吴思远的单只主题基金持仓达到 140 万元；许知夏的日常备用金低于建议水平；陈舒桐教育金储蓄进度落后；张雨桐连续三次服务沟通未回应；李文静大额保费到期前资金不足；高远的行业集中度超过约定配置上限。</span>
            <button type="button" onClick={() => setSummaryExpanded(summaryExpanded === 'risk' ? null : 'risk')}>
              {summaryExpanded === 'risk' ? '收起' : '展开'}
            </button>
          </div>
          <div className={summaryExpanded === 'followup' ? 'is-expanded' : ''}>
            <strong>推荐行动：</strong>
            <span>联系周启明确认购房尾款资金方案；复核林若岚的资产配置并准备再平衡建议；更新刘志远养老规划的关键假设；重新联系沈嘉成并安排年度服务回顾；核查吴思远集中持仓的减持路径；确认许知夏的备用金补足方案；更新陈舒桐教育金计划；安排张雨桐服务回访并调整沟通方式。</span>
            <button type="button" onClick={() => setSummaryExpanded(summaryExpanded === 'followup' ? null : 'followup')}>
              {summaryExpanded === 'followup' ? '收起' : '展开'}
            </button>
          </div>
        </div>
      </Card>



      <Row gutter={[12, 12]} className="metric-grid">
        <Col xs={24} sm={12} xl={6}>
          <Card variant="borderless" className="metric-card">
            <div className="metric-icon purple"><AuditOutlined /></div>
            <div><Text type="secondary">本机构管理资产（AUM）</Text><div className="metric-value-row"><strong>7.224</strong><span className="metric-unit">亿元</span><span className="metric-positive">↑ 3.8% 较上季度</span></div></div>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card variant="borderless" className="metric-card">
            <div className="metric-icon cyan"><TeamOutlined /></div>
            <div><Text type="secondary">客户总数</Text><div className="metric-value-row"><strong>153</strong><span className="metric-unit">位</span><span className="metric-positive">本月新增 4 位</span></div></div>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card variant="borderless" className="metric-card">
            <div className="metric-icon red"><WalletOutlined /></div>
            <div><Text type="secondary">本机构资产占比</Text><div className="metric-value-row"><strong>68</strong><span className="metric-unit">%</span><span className="metric-positive">↑ 2.1 个百分点</span></div></div>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card variant="borderless" className="metric-card">
            <div className="metric-icon amber"><BankOutlined /></div>
            <div><Text type="secondary">他行金融资产</Text><div className="metric-value-row"><strong>1,790</strong><span className="metric-unit">万元</span><span className="metric-note">涉及 23 位客户</span></div></div>
          </Card>
        </Col>
      </Row>

      <div className="dashboard-grid risk-followup-grid">
        <Card variant="borderless" className="ds-page-card priority-card risk-alert-card">
          <div className="card-toolbar">
            <div className="card-title-row"><h3>AI 风险提醒</h3></div>
            <Input
              id="risk-search"
              name="risk-search"
              allowClear
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              prefix={<SearchOutlined />}
              placeholder="搜索客户或风险"
              className="task-search"
            />
          </div>

          <Tabs
            className="risk-tabs"
            activeKey={filter}
            onChange={(value) => setFilter(value as RiskFilter)}
            items={filterOptions.map((option) => ({
              key: option.value,
              label: (
                <span className="risk-tab-label">
                  {option.label}
                  <b>{option.value === '全部' ? riskAlerts.length : riskAlerts.filter((risk) => risk.category === option.value).length}</b>
                </span>
              ),
            }))}
          />

          <div className="risk-alert-list">
            {alerts.map((risk) => (
              <div
                className="risk-alert-row"
                tabIndex={0}
                role="group"
                aria-label={`${risk.customer}，${risk.summary}，按回车查看风险`}
                onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onOpenRisk(risk) } }}
                key={risk.id}
                onClick={() => onOpenRisk(risk)}
              >
                <CustomerAvatar name={risk.customer} />
                <div className="risk-list-content">
                  <div className="risk-list-title">
                    <strong>{risk.customer}</strong>
                    <Tag color="blue" variant="filled">{risk.category}</Tag>
                    <Tag variant="filled" color={priorityMeta[risk.priority].color} className={`risk-priority ${priorityMeta[risk.priority].className}`}>{risk.priority}风险</Tag>
                  </div>
                  <div className="risk-list-description">
                    <span>{risk.summary}</span>
                    <i aria-hidden="true" />
                    <span><ClockCircleOutlined /> {risk.urgency}</span>
                    <i aria-hidden="true" />
                    <span>AI 优先级 {risk.score}</span>
                  </div>
                </div>
                <div className="risk-impact">
                  <RiskImpactValue value={risk.impactValue} />
                  <span>{risk.impactLabel}</span>
                </div>
                <Button size="small" onClick={(event) => { event.stopPropagation(); onOpenRisk(risk) }}>处理风险</Button>
              </div>
            ))}
            {alerts.length === 0 && <div className="priority-empty">没有符合条件的风险提醒</div>}
          </div>
        </Card>

        <Card variant="borderless" className="ds-page-card followup-card">
          <div className="card-title-row with-action">
            <div><h3>AI 推荐行动</h3></div>
            <Tag color="blue" variant="filled">{followUpItems.length} 项</Tag>
          </div>
          <div className="followup-list">
            {followUpItems.map((item) => (
              <div className="followup-item" key={item.id}>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <div className="followup-action-row">
                  <Tag color={item.tone} variant="filled">{item.due}</Tag>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      const linkedRisk = riskAlerts.find((risk) => risk.id === item.riskId)
                      if (linkedRisk) onOpenRisk(linkedRisk)
                    }}
                  >
                    {item.action}
                    <ArrowRightOutlined />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card variant="borderless" className="ds-page-card portfolio-analytics-card">
        <div className="card-title-row analytics-header">
          <h3>客户资产全景</h3>
          <Text type="secondary">数据更新于 09:00</Text>
        </div>

        <div className="portfolio-analytics-grid">
          <section className="analytics-section asset-mix-section">
            <div className="analytics-section-title"><span><strong>各类资产占比</strong></span></div>
            <AssetDonut />
          </section>

          <section className="analytics-section">
            <div className="analytics-section-title with-stat">
              <span><strong>本机构资产占比分布</strong></span>
              <b>平均 68%</b>
            </div>
            <div className="wallet-bars">
              {walletData.map((item) => (
                <div className="chart-bar-row" key={item.label}>
                  <div><span>{item.label}</span><strong>{item.clients} 人</strong></div>
                  <div className="chart-bar-track"><i style={{ width: `${item.width}%` }} /></div>
                </div>
              ))}
            </div>
          </section>

          <AssetDistribution />
        </div>
      </Card>
    </div>
  )
}
