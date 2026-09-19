import {
  FileTextOutlined,
  HistoryOutlined,
  PhoneOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { Button, Card, Drawer, Tag } from 'antd'
import { useState } from 'react'
import wealthLogo from '../../asset/logo.svg'
import { wealthClients } from '../data'
import type { RiskAlert } from '../types'
import { ContactClientModal } from './ContactClientModal'

interface QuickActionDrawerProps {
  risk: RiskAlert | null
  open: boolean
  onClose: () => void
  onOpenClient: (clientId: string) => void
}

const riskCopy = {
  流动性风险: {
    sources: [
      'AI 对未来 30 天的已知收支、账户可用余额和大额支出日历进行了交叉核对。当前可直接调度的现金与货币基金不足以覆盖临近付款，同时保留日常备用金后，资金缺口进一步扩大。',
      '系统没有在付款日前发现足额的定期到期、产品赎回或已确认转入资金。若临时赎回中长期资产，还需要考虑到账时间、赎回费用以及对原有配置计划的影响。',
      '本次提醒同时参考了客户最近一次沟通纪要与历史资金安排。由于付款日期明确、可处理时间有限，AI 将该事项列为需要优先确认的风险。',
    ],
    nextSteps: [
      '先与客户核实付款金额、最晚到账时间和他行可调入资金，确认风险识别所依据的信息是否发生变化。',
      '如缺口仍然存在，可进入智能方案，对比“他行资金转入、短久期资产赎回、组合内筹资”三条路径的到账速度、成本和配置影响。',
      '方案确认后，AI 可继续生成电话沟通提纲、客户可读说明和所需材料清单，并把客户结论、责任人与完成时间写入跟进记录。',
    ],
  },
  投资组合风险: {
    sources: [
      'AI 将最新持仓与客户已确认的目标配置区间进行比对，发现当前权益、行业或单一产品敞口已经超过约定上限，组合风险与客户风险承受能力出现偏离。',
      '偏离主要来自近期市场波动和部分资产上涨，并非客户主动调整。若继续维持当前结构，组合回撤、行业集中和流动性压力可能同步增加。',
      '系统还核对了产品持有期、赎回规则、成本与历史沟通记录，当前尚未发现客户已明确接受本次偏离，因此需要顾问进一步确认。',
    ],
    nextSteps: [
      '先复核客户近期资金用途与风险偏好，确认目标配置仍然有效，并排除即将发生的大额支出或追加投资。',
      '进入智能方案后，可生成维持、分步再平衡和一次性再平衡三种路径，对比预计风险、交易成本和执行周期。',
      '选定路径后，AI 可准备配置对比图、沟通提纲与合规提示；客户确认后再创建执行任务并记录选择依据。',
    ],
  },
  目标偏离: {
    sources: [
      'AI 依据客户最新资产、持续投入金额与目标期限重新测算计划完成度，发现当前进度已经低于原计划区间。',
      '差距可能来自储蓄节奏放缓、市场收益变化或目标金额上调。系统已将这些变化与上次规划假设逐项比对，并标记需要人工确认的关键变量。',
      '如果继续沿用现有投入与配置，目标达成概率可能进一步下降，因此该事项被纳入近期服务复盘。',
    ],
    nextSteps: [
      '先向客户确认收入、支出、目标金额和目标时间是否变化，更新影响测算结果的基础假设。',
      '进入智能方案后，对比增加定投、调整目标时间与优化资产配置等路径，并展示每种方案对现金流和达成概率的影响。',
      '与客户确认可接受的调整后，AI 可生成规划复盘材料、会议提纲和后续任务，形成可追踪的服务记录。',
    ],
  },
  客户流失风险: {
    sources: [
      'AI 汇总最近联系时间、会议取消、消息回复和资产变动记录，发现客户互动频率明显低于其历史水平及同类客户服务基准。',
      '近期多次服务触达没有形成有效回应，且尚未安排下一次正式回顾。持续缺少互动会削弱顾问对客户需求变化的判断，也可能增加资产转出的风险。',
      '系统未发现已关闭的服务事项或客户主动要求降低联系频率，因此建议尽快由顾问核实真实原因。',
    ],
    nextSteps: [
      '优先选择客户常用渠道进行一次低打扰触达，确认合适的沟通时间和近期最关心的事项。',
      '进入智能方案后，AI 可结合历史服务记录生成个性化回访切入点、年度回顾议程和需要提前准备的资料。',
      '完成沟通后记录客户反馈、服务问题与下一次联系时间；如仍无回应，可创建分阶段触达任务并设置升级提醒。',
    ],
  },
} satisfies Record<RiskAlert['category'], { sources: string[]; nextSteps: string[] }>

export function QuickActionDrawer({ risk, open, onClose, onOpenClient }: QuickActionDrawerProps) {
  const [contactOpen, setContactOpen] = useState(false)
  if (!risk) return null

  const client = wealthClients.find((item) => item.id === risk.id)
  const copy = riskCopy[risk.category]
  const priorityColor = risk.priority === '高' ? 'error' : risk.priority === '中' ? 'orange' : 'success'
  const references = [
    { icon: <WalletOutlined />, title: '资产与现金流快照', meta: `${client?.aum ?? '待核实'} · 本机构资产占比 ${client?.walletShare ?? '--'}%` },
    { icon: <HistoryOutlined />, title: '最近服务与沟通记录', meta: `最近联系 ${client?.recentContact ?? '待核实'} · ${client?.nextAction ?? '待补充行动'}` },
    { icon: <FileTextOutlined />, title: '客户档案与目标计划', meta: `${client?.clientNo ?? '客户编号待补充'} · ${client?.segment ?? '客户类型待核实'}` },
    { icon: <SafetyCertificateOutlined />, title: '风险识别计算快照', meta: `AI 优先级 ${risk.score} · 数据更新于 9 月 18 日 09:00` },
  ]

  return <>
    <Drawer
      open={open && !contactOpen}
      size="min(600px, 100vw)"
      onClose={onClose}
      rootClassName="risk-insight-drawer"
      closable={{ placement: 'end' }}
      title={(
        <div className="risk-drawer-title">
          <strong>{risk.customer}</strong>
          <Tag color={priorityColor} variant="filled" className={risk.priority === '低' ? 'success-tag' : undefined}>{risk.category} · {risk.priority}风险</Tag>
        </div>
      )}
      footer={(
        <div className="risk-drawer-footer">
          <Button icon={<PhoneOutlined />} onClick={() => setContactOpen(true)}>联系客户</Button>
          <Button type="primary" className="ai-primary-button" icon={<StarOutlined />} onClick={() => onOpenClient(risk.id)}>查看智能方案</Button>
        </div>
      )}
    >
      <Card variant="borderless" className="ai-brief-card ai-summary-card drawer-ai-analysis">
        <div className="ai-summary-heading">
          <span className="ai-summary-mark"><img src={wealthLogo} alt="" /></span>
          <h2>AI 风险分析</h2>
        </div>

        <div className="risk-analysis-impact">
          <div><span>{risk.impactLabel}</span><strong>{risk.impactValue}</strong></div>
          <Tag color={priorityColor} variant="filled" className={risk.priority === '低' ? 'success-tag' : undefined}>{risk.urgency}</Tag>
        </div>

        <section className="risk-analysis-step">
          <div className="risk-analysis-step-title"><b>1</b><strong>识别风险来源</strong></div>
          <ul>{copy.sources.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <section className="risk-analysis-step">
          <div className="risk-analysis-step-title"><b>2</b><strong>下一步建议</strong></div>
          <ul>{copy.nextSteps.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      </Card>

      <section className="risk-reference-section" aria-label="判断依据资料">
        <div className="risk-reference-heading">
          <div><h3>判断依据资料</h3><span>AI 已索引 4 组与本次风险相关的客户资料</span></div>
        </div>
        <div className="risk-reference-list">
          {references.map((item) => (
            <button type="button" key={item.title} onClick={() => onOpenClient(risk.id)}>
              <span className="risk-reference-icon">{item.icon}</span>
              <span><strong>{item.title}</strong><small>{item.meta}</small></span>
              <RightOutlined />
            </button>
          ))}
        </div>
      </section>
    </Drawer>

    <ContactClientModal
      open={contactOpen}
      onClose={() => setContactOpen(false)}
      name={risk.customer}
      risk={risk}
    />
  </>
}
