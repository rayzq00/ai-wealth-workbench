import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  PhoneOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { Area } from '@ant-design/charts'
import {
  Button,
  Card,
  ConfigProvider,
  Space,
  Tabs,
  Tag,
  Typography,
} from 'antd'
import { useState } from 'react'
import type { ReactNode } from 'react'
import wealthLogo from '../../asset/logo.svg'
import { ContactClientModal } from '../components/ContactClientModal'
import { ServiceWorkflow } from '../components/ServiceWorkflow'
import { riskAlerts } from '../data'
import type { RiskAlert, WealthClient } from '../types'

const { Title } = Typography

type ClientInfoItem = {
  key: string
  label: string
  value: ReactNode
}

function ClientInfoGrid({ items }: { items: ClientInfoItem[] }) {
  return (
    <div className="client-detail-info-grid">
      {items.map((item) => (
        <div className="client-detail-info-item" key={item.key}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  )
}

interface ClientDetailProps {
  client: WealthClient
  onBack: () => void
  initialRisk?: RiskAlert | null
  onReturnRisk?: () => void
}

const documents = [
  { name: '2026 年度个人资产回顾.pdf', category: '资产报告', updated: '2026 年 9 月 16 日', status: '最新版' },
  { name: '购房资金安排与现金流测算.xlsx', category: '现金流', updated: '2026 年 9 月 18 日', status: '待确认' },
  { name: '个人资产配置建议书.pdf', category: '配置建议', updated: '2026 年 6 月 28 日', status: '已确认' },
  { name: '个人客户风险承受能力测评.pdf', category: '风险测评', updated: '2026 年 3 月 12 日', status: '有效' },
  { name: '投资者适当性匹配意见书.pdf', category: '合规材料', updated: '2026 年 3 月 12 日', status: '已签署' },
  { name: '2026 年第二季度服务纪要.docx', category: '服务记录', updated: '2026 年 7 月 2 日', status: '已归档' },
  { name: '个人收支与未来三年支出计划.xlsx', category: '财务资料', updated: '2026 年 8 月 26 日', status: '客户提供' },
  { name: '客户身份与税务居民声明.pdf', category: '客户档案', updated: '2026 年 1 月 8 日', status: '有效' },
]

export function ClientDetail({ client, onBack, initialRisk }: ClientDetailProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [panelOpen, setPanelOpen] = useState(Boolean(initialRisk))
  const [panelStarted, setPanelStarted] = useState(Boolean(initialRisk))
  const [contactOpen, setContactOpen] = useState(false)
  const [riskResolved, setRiskResolved] = useState(false)

  const openService = () => {
    setPanelStarted(true)
    setPanelOpen(true)
  }

  const risk = riskAlerts.find((item) => item.id === client.id)
  const aumValue = Number.parseFloat(client.aum) || 265.8
  const cash = client.id === 'diaz' ? 8.2 : Number((aumValue * 0.08).toFixed(2))
  const equity = Number((aumValue * (client.id === 'lauren' ? 0.61 : client.id === 'nguyen' ? 0.55 : 0.4)).toFixed(2))
  const fixed = Number((aumValue * (client.id === 'lauren' ? 0.25 : client.id === 'nguyen' ? 0.3 : 0.5)).toFixed(2))
  const other = Number((aumValue - cash - equity - fixed).toFixed(2))
  const allocation = [
    { label: '权益类基金', amount: equity, color: '#2498df' },
    { label: '银行理财及债券基金', amount: fixed, color: '#ffca3a' },
    { label: '活期及可用资金', amount: cash, color: '#22b8bd' },
    { label: '其他金融资产', amount: other, color: '#8b74d9' },
  ].map((item) => ({ ...item, value: Number((item.amount / aumValue * 100).toFixed(1)) }))

  let edge = 0
  const donutBackground = `conic-gradient(${allocation.map((item) => {
    const start = edge
    edge += item.amount / aumValue * 100
    return `${item.color} ${start}% ${edge}%`
  }).join(', ')})`

  const accounts = allocation.map((item) => ({
    name: item.label,
    status: '本机构持仓',
    strategy: item.label === '活期及可用资金' ? '可用于近期支出' : '赎回规则以产品说明为准',
    value: `${item.amount.toFixed(2)} 万元`,
  }))

  const trendRatios = [0.925, 0.938, 0.951, 0.947, 0.968, 0.985, 0.978, 1.004, 0.992, 1.018, 1.011, 1]
  const trendMonths = ['10 月', '11 月', '12 月', '1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月']
  const trendData = trendMonths.map((month, index) => ({ month, value: Number((aumValue * trendRatios[index]).toFixed(1)) }))
  const trendChange = ((aumValue / trendData[0].value - 1) * 100).toFixed(1)
  const trendConfig = {
    data: trendData,
    xField: 'month',
    yField: 'value',
    height: 230,
    autoFit: true,
    paddingRight: 18,
    scale: { y: { nice: true } },
    style: { fill: 'l(270) 0:rgba(22,119,255,0.02) 1:rgba(22,119,255,0.18)' },
    line: { style: { stroke: '#1677ff', lineWidth: 2 } },
    axis: {
      x: { title: false, labelFontSize: 11, labelAutoRotate: false },
      y: { title: false, labelFontSize: 11, labelFormatter: (value: number) => `${value}万`, gridLineDash: [4, 4] },
    },
    tooltip: { title: 'month', items: [{ field: 'value', name: '本机构资产', valueFormatter: (value: number) => `${value} 万元` }] },
    interaction: { tooltip: { marker: true } },
  }

  const overview = (
    <div className="client-overview-content">
      <Card variant="borderless" className="client-holdings-card">
        <div className="client-section-header"><div><strong>资产概览</strong></div></div>
        <div className="holding-metrics">
          <div><span>本机构金融资产</span><strong>{client.aum}</strong></div>
          <div><span>持仓投入本金</span><strong>{(aumValue * 0.78).toFixed(1)} 万元</strong></div>
          <div><span>可用资金</span><strong>{cash.toFixed(2)} 万元</strong></div>
          <div><span>持仓浮动盈亏</span><strong className="positive">↑ {(aumValue * 0.22).toFixed(1)} 万元</strong></div>
        </div>

        <div className="client-holdings-visuals">
          <section className="client-allocation-panel">
            <div className="client-visual-heading"><div><strong>资产配置</strong><span>按主要资产类别</span></div></div>
            <div className="client-allocation-layout">
              <div className="client-allocation-donut" style={{ background: donutBackground }}><div><strong>{client.aum}</strong><span>本机构资产</span></div></div>
              <div className="client-allocation-legend">
                {allocation.map((item) => <div key={item.label}><i style={{ background: item.color }} /><span>{item.label}</span><strong>{item.value}%</strong></div>)}
              </div>
            </div>
          </section>

          <section className="client-trend-panel">
            <div className="client-visual-heading with-stat"><div><strong>近 12 个月资产变化</strong><span>本机构金融资产月末市值</span></div><b>较期初 +{trendChange}%</b></div>
            <Area {...trendConfig} />
          </section>
        </div>
      </Card>

      <Card variant="borderless" className="client-accounts-card">
        <div className="client-section-header"><div><strong>本机构持仓明细</strong></div></div>
        <div className="client-account-list">
          {accounts.map((account) => (
            <div className="client-account-row" key={account.name}>
              <div className="account-name"><strong>{account.name}</strong><Tag variant="filled" color="blue">{account.status}</Tag><span>{account.strategy}</span></div>
              <strong>{account.value}</strong>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const details = (
    <div className="client-details-grid">
      <Card variant="borderless" className="client-tab-placeholder client-detail-info-card">
        <div className="client-tab-section-heading"><h3>客户基本信息</h3><span>更新于 2026 年 9 月 18 日</span></div>
        <ClientInfoGrid items={[
          { key: '1', label: '客户编号', value: client.clientNo },
          { key: '2', label: '客户分层', value: client.segment },
          { key: '3', label: '服务状态', value: client.status },
          { key: '4', label: '负责顾问', value: '顾明远 · 上海一部' },
          { key: '5', label: '开户日期', value: '2021 年 6 月 18 日' },
          { key: '6', label: '常住城市', value: '上海市浦东新区' },
          { key: '7', label: '职业情况', value: '民营企业高级管理人员' },
          { key: '8', label: '客户来源', value: '存量客户转介绍' },
        ]} />
      </Card>

      <Card variant="borderless" className="client-tab-placeholder client-detail-info-card">
        <div className="client-tab-section-heading"><h3>联系人与沟通偏好</h3><Button size="small" icon={<PhoneOutlined />} onClick={() => setContactOpen(true)}>发起联系</Button></div>
        <ClientInfoGrid items={[
          { key: '1', label: '主要联系人', value: client.name },
          { key: '2', label: '联系电话', value: '138 **** 6298' },
          { key: '3', label: '电子邮箱', value: 'qiming.zhou@example.cn' },
          { key: '4', label: '首选渠道', value: '电话、企业微信' },
          { key: '5', label: '适合联系时间', value: '工作日 10:00–16:00' },
          { key: '6', label: '沟通频率', value: '每季度一次正式回顾' },
          { key: '7', label: '备用联系人', value: '王女士（已获客户授权）' },
          { key: '8', label: '沟通备注', value: '联系前通过企业微信确认时间，偏好先看数据再讨论方案' },
        ]} />
      </Card>

      <Card variant="borderless" className="client-tab-placeholder client-detail-info-card">
        <div className="client-tab-section-heading"><h3>投资与合规信息</h3><span>部分信息需定期复核</span></div>
        <ClientInfoGrid items={[
          { key: '1', label: '风险承受能力', value: 'C3 平衡型' },
          { key: '2', label: '测评有效期', value: '至 2027 年 3 月 11 日' },
          { key: '3', label: '主要投资目标', value: '资产稳健增值、退休现金流' },
          { key: '4', label: '建议投资期限', value: '5 年以上' },
          { key: '5', label: '本机构资产占比', value: `${client.walletShare}%` },
          { key: '6', label: '他行金融资产', value: '约 103.4 万元（客户申报）' },
          { key: '7', label: '税收居民身份', value: '仅为中国税收居民' },
          { key: '8', label: 'KYC 最近更新', value: '2026 年 1 月 8 日' },
          { key: '9', label: '近期资金目标', value: '2026 年 10 月支付购房尾款 25 万元' },
          { key: '10', label: '流动性偏好', value: '保留不少于 3 个月日常支出的备用金' },
        ]} />
      </Card>

      <Card variant="borderless" className="client-tab-placeholder client-detail-info-card">
        <div className="client-tab-section-heading"><h3>近期服务记录</h3><span>最近 90 天</span></div>
        <div className="client-service-history">
          <div><b>9 月 18 日</b><span><strong>AI 识别流动性风险</strong><small>购房尾款付款日前预计存在 16.8 万元资金缺口，等待顾问确认。</small></span></div>
          <div><b>9 月 12 日</b><span><strong>企业微信沟通</strong><small>客户确认购房流程正在推进，付款日期预计为 10 月 9 日。</small></span></div>
          <div><b>8 月 26 日</b><span><strong>更新个人收支资料</strong><small>客户补充未来三年支出计划，暂未确认他行可调度资金。</small></span></div>
          <div><b>7 月 2 日</b><span><strong>季度资产回顾</strong><small>维持平衡型配置，约定重大资金用途发生变化时及时复核。</small></span></div>
        </div>
      </Card>
    </div>
  )

  const documentContent = (
    <Card variant="borderless" className="client-tab-placeholder client-documents-card">
      <div className="client-tab-section-heading"><h3>客户文档</h3><span>共 {documents.length} 份资料</span></div>
      <div className="client-document-list">
        {documents.map((document) => (
          <div className="client-document-row" key={document.name}>
            <FileTextOutlined />
            <div><strong>{document.name}</strong><span>{document.category} · 更新于 {document.updated}</span></div>
            <Tag className="client-document-status" variant="filled" color={document.status === '待确认' ? 'warning' : 'default'}>{document.status}</Tag>
            <Button type="link">查看</Button>
          </div>
        ))}
      </div>
    </Card>
  )

  return (
    <div className="ds-page-shell client-detail-page">
      <div className="client-detail-topbar">
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack}>返回客户中心</Button>
        <Space>
          <Button icon={<PhoneOutlined />} onClick={() => setContactOpen(true)}>联系客户</Button>
          <Button icon={<EditOutlined />} onClick={(event) => event.currentTarget.blur()}>编辑信息</Button>
        </Space>
      </div>

      <div className={`client-detail-workspace ${panelOpen ? 'has-service-panel' : ''}`}>
        <div className="client-detail-main">
          <div className="client-profile-header">
            <div className="client-profile-title-row">
              <Title level={3}>{client.name}</Title>
              <Space wrap size={[6, 6]} className="client-profile-tags">
                <Tag variant="filled" color={client.status === '风险关注' ? 'error' : 'success'} className={client.status === '风险关注' ? undefined : 'success-tag'}>{client.status}</Tag>
                {client.segment === '高净值客户' && <Tag variant="filled" color="gold">重点客户</Tag>}
                <Tag className="client-meta-tag">{client.clientNo}</Tag>
                <Tag className="client-meta-tag">{client.segment}</Tag>
              </Space>
            </div>
            <div className="client-profile-facts">
              <span><CalendarOutlined />开户日期：2021.06.18</span><i />
              <span><WalletOutlined />本机构资产：{client.aum}</span><i />
              <span><ClockCircleOutlined />最近联系：{client.recentContact}</span><i />
              <span><SafetyCertificateOutlined />风险测评：C3 平衡型</span>
            </div>
          </div>

          <Card variant="borderless" className="ai-brief-card ai-summary-card client-risk-summary-card">
            <div className="client-risk-inline">
              <span className="ai-summary-mark"><img src={wealthLogo} alt="" /></span>
              <strong>{riskResolved ? 'AI 风险已处理：' : risk ? 'AI 发现潜在风险：' : 'AI 服务建议：'}</strong>
              <span>{riskResolved ? '沟通结果和下次跟进日期已经保存，本次风险已完成处理。如客户情况发生变化，AI 将重新评估风险状态。' : risk ? `${risk.summary}。预计影响 ${risk.impactValue}，${risk.urgency}，建议结合客户完整资产和资金安排进一步确认。` : '结合近期资产变化与服务记录，建议准备本季度资产回顾。'}</span>
              {riskResolved ? <Button className="client-risk-complete-button" icon={<CheckCircleOutlined />}>已完成</Button> : <Button type="primary" className="ai-primary-button" onClick={openService}>{risk ? '处理风险' : '生成智能方案'}</Button>}
            </div>
          </Card>

          <Tabs
            className="client-detail-tabs"
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: 'overview', label: '概览', children: overview },
              { key: 'details', label: '详细资料', children: details },
              { key: 'documents', label: '文档', children: documentContent },
            ]}
          />
        </div>

        {panelStarted && <aside hidden={!panelOpen} className="client-service-panel" aria-label="AI 服务推进面板">
          <div className="client-service-panel-header"><div><RobotOutlined /><strong>AI 服务助手</strong><span>{client.name}</span></div><Button type="text" icon={<CloseOutlined />} aria-label="收起服务面板" onClick={() => setPanelOpen(false)} /></div>
          <div className="client-service-panel-scroll">
            <ConfigProvider theme={{ token: { colorPrimary: '#5751FF', colorInfo: '#5751FF', colorLink: '#5751FF' } }}>
              <ServiceWorkflow clientId={client.id} name={client.name} risk={risk} embedded onComplete={() => setRiskResolved(true)} />
            </ConfigProvider>
          </div>
        </aside>}
      </div>
      <ContactClientModal open={contactOpen} onClose={() => setContactOpen(false)} name={client.name} risk={risk} />
    </div>
  )
}
