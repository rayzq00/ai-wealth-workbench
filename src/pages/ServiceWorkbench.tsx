import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  CopyOutlined,
  DatabaseOutlined,
  EditOutlined,
  ExportOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  MessageOutlined,
  ReloadOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
  ThunderboltFilled,
} from '@ant-design/icons'
import {
  Alert,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Descriptions,
  Divider,
  Input,
  Modal,
  Progress,
  Segmented,
  Select,
  Space,
  Steps,
  Tag,
  Timeline,
  Typography,
} from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AssetDonut } from '../components/AssetDonut'
import { clientFacts, deliverables } from '../data'
import type { ClientAction, DeliverableType } from '../types'

const { Text, Title } = Typography
const { TextArea } = Input

interface ServiceWorkbenchProps {
  client: ClientAction
  onBack: () => void
}

const deliverableIcons: Record<DeliverableType, ReactNode> = {
  建议: <ThunderboltFilled />,
  提纲: <MessageOutlined />,
  报告: <FileTextOutlined />,
  纪要: <FileDoneOutlined />,
}

export function ServiceWorkbench({ client, onBack }: ServiceWorkbenchProps) {
  const [activeType, setActiveType] = useState<DeliverableType>('建议')
  const [prompt, setPrompt] = useState(deliverables[0].prompt.replace('林若岚', client.name))
  const [generated, setGenerated] = useState<Set<DeliverableType>>(new Set(['建议']))
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(100)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [archived, setArchived] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const activeDeliverable = useMemo(
    () => deliverables.find((item) => item.key === activeType) ?? deliverables[0],
    [activeType],
  )

  useEffect(() => () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
  }, [])

  const selectDeliverable = (type: DeliverableType) => {
    const item = deliverables.find((deliverable) => deliverable.key === type) ?? deliverables[0]
    setActiveType(type)
    setPrompt(item.prompt.replace('林若岚', client.name))
  }

  const generate = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    setGenerating(true)
    setProgress(12)

    intervalRef.current = window.setInterval(() => {
      setProgress((current) => Math.min(current + 13, 90))
    }, 180)

    timeoutRef.current = window.setTimeout(() => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      setProgress(100)
      setGenerating(false)
      setGenerated((current) => new Set([...current, activeType]))
    }, 1400)
  }

  const deliverableOutput = () => {
    if (activeType === '建议') {
      return (
        <div className="generated-output suggestion-output">
          <div className="output-section">
            <div className="output-kicker">01 · 客观事实</div>
            <ul>
              <li>行业主题基金占可投资资产 <strong>46.8%</strong>，高于内部建议区间上限 30%。</li>
              <li>客户风险承受能力为 C4，测评有效；未来 12 个月存在 150 万确定性教育资金需求。</li>
              <li>近 30 日组合波动率由 15.7% 升至 21.4%。</li>
            </ul>
          </div>
          <div className="output-section risk-inference">
            <div className="output-kicker">02 · 风险判断</div>
            <p>流动性需求与高波动资产集中同时出现。若行业主题资产回撤 25%，预计整体组合回撤约 14.6%，可能影响一年内资金安排。</p>
            <div className="evidence-chips"><span>持仓快照 09:10</span><span>适当性测评 2026-01-12</span><span>压力测试模型 v3.6</span></div>
          </div>
          <div className="output-section">
            <div className="output-kicker">03 · 建议动作</div>
            <div className="action-plan-list">
              <div><b>1</b><span><strong>先确认资金安排</strong><small>确认教育支出时间、币种及是否还有其他流动性需求。</small></span></div>
              <div><b>2</b><span><strong>提供分阶段调整选择</strong><small>方案 A：2–4 周降低主题基金 10%–15%；方案 B：保留核心仓位并增加 150 万现金管理层。</small></span></div>
              <div><b>3</b><span><strong>完成适当性与客户确认</strong><small>任何交易动作均需完成适当性校验，并由客户确认后执行。</small></span></div>
              <div><b>4</b><span><strong>设定复查节点</strong><small>30 天后复查集中度与流动性覆盖率。</small></span></div>
            </div>
          </div>
        </div>
      )
    }

    if (activeType === '提纲') {
      return (
        <div className="generated-output outline-output">
          <Timeline
            items={[
              { color: '#6b5cff', content: <div><strong>开场与授权 · 1 分钟</strong><p>“林女士您好，我注意到近期组合结构有一些变化，想占用您几分钟，一起确认近期资金安排是否有调整。”</p></div> },
              { color: '#2fb8c6', content: <div><strong>确认需求 · 2 分钟</strong><p>确认教育资金支付节点、币种，以及未来一年是否还有其他大额支出。</p></div> },
              { color: '#ef7285', content: <div><strong>解释风险 · 2 分钟</strong><p>使用“每 100 元中约 47 元集中在同一主题”解释集中度，并展示压力测试区间。</p></div> },
              { color: '#f1aa54', content: <div><strong>呈现选择 · 2 分钟</strong><p>提供分阶段降低集中度或建立流动性缓冲层两种方案，不预设客户选择。</p></div> },
              { color: '#43a590', content: <div><strong>确认下一步 · 1 分钟</strong><p>复述客户决定，约定材料发送方式和下次沟通时间。</p></div> },
            ]}
          />
          <Divider />
          <div className="objection-grid">
            <div><strong>客户可能说：“我仍然看好这个行业。”</strong><p>回应重点：认可长期判断，讨论的是短期资金需求下的仓位韧性，而非预测行业涨跌。</p></div>
            <div><strong>客户可能说：“现在调整会不会卖在低点？”</strong><p>回应重点：提供分阶段方案，降低择时依赖，并保留核心仓位。</p></div>
          </div>
        </div>
      )
    }

    if (activeType === '报告') {
      return (
        <div className="generated-output report-preview">
          <div className="report-cover-line"><span>客户资产诊断简报</span><Tag variant="filled">2026.09.17</Tag></div>
          <h2>{client.name}女士资产配置观察</h2>
          <p>本报告基于截至 2026 年 9 月 17 日的账户持仓与客户资料生成，供沟通参考。</p>
          <div className="report-metrics">
            <div><span>组合市值</span><strong>¥1,286 万</strong></div>
            <div><span>权益类占比</span><strong>58%</strong></div>
            <div><span>流动性覆盖</span><strong>8.4 个月</strong></div>
          </div>
          <div className="report-chart">
            <AssetDonut compact />
          </div>
          <Alert type="warning" showIcon title="需要关注：部分资产集中于单一行业主题，短期波动可能影响既定资金安排。" />
          <p className="report-disclaimer">风险提示：以上情景分析不代表实际损失或收益，历史表现不预示未来结果。</p>
        </div>
      )
    }

    return (
      <div className="generated-output minutes-output">
        <Alert type="info" showIcon title="以下内容由 AI 根据预置沟通记录生成；未明确的信息已标记为待确认。" />
        <Descriptions
          column={1}
          items={[
            { key: 'attitude', label: '客户态度', children: '理解集中度风险，但希望保留行业主题基金核心仓位。' },
            { key: 'confirmed', label: '已确认事实', children: '150 万教育资金预计在 2027 年 3 月支付，以人民币支付。' },
            { key: 'decision', label: '初步决定', children: '同意先建立 150 万现金管理层；是否降低主题仓位待阅读报告后确认。' },
            { key: 'owner', label: '后续动作', children: '顾明远于今天 18:00 前发送资产诊断报告；客户将在 9 月 19 日前反馈。' },
            { key: 'unknown', label: '待确认', children: <Tag color="warning" variant="filled">子女教育缴费具体日期</Tag> },
          ]}
        />
        <TextArea rows={5} defaultValue="补充备注：客户希望方案中保留对长期行业判断的说明，并避免一次性调整。" />
      </div>
    )
  }

  return (
    <div className="ds-page-shell service-page">
      <Breadcrumb separator="/" items={[{ title: 'AI 工作台' }, { title: client.name }, { title: '服务工作流' }]} />
      <div className="ds-page-header service-header">
        <Space size={12} align="center">
          <Button icon={<ArrowLeftOutlined />} onClick={onBack}>返回</Button>
          <Avatar size={42} className="customer-avatar" style={{ color: client.accent, backgroundColor: `${client.accent}1f`, borderColor: `${client.accent}3d` }}>{client.initials}</Avatar>
          <div>
            <div className="page-title-line"><Title level={4} className="ds-page-title">{client.name} · AI 服务工作台</Title><Tag variant="filled" color="error">高优先级</Tag></div>
            <Text type="secondary">围绕风险事件生成、审核并完成客户跟进材料</Text>
          </div>
        </Space>
        <Space className="ds-page-header-extra">
          <Tag icon={<DatabaseOutlined />} variant="filled">数据更新 09:12</Tag>
          {archived ? <Tag color="success" className="success-tag" icon={<CheckCircleFilled />}>已归档</Tag> : <Button type="primary" className="ai-primary-button" onClick={() => setArchiveOpen(true)}>完成并归档</Button>}
        </Space>
      </div>

      <div className="service-context-grid">
        <Card variant="borderless" className="ds-page-card client-context-card">
          <div className="card-title-row with-action">
            <div><h3>客户上下文</h3><Text type="secondary">生成内容将引用以下已核验信息</Text></div>
            <Button type="link" icon={<EditOutlined />}>编辑资料</Button>
          </div>
          <Descriptions size="small" column={3} items={clientFacts.map((item) => ({ key: item.label, label: item.label, children: item.value }))} />
        </Card>
        <Card variant="borderless" className="ds-page-card risk-evidence-card">
          <div className="risk-evidence-icon"><SafetyCertificateOutlined /></div>
          <div><Text type="secondary">当前服务触发</Text><strong>{client.event}</strong><span>{client.evidence}</span></div>
        </Card>
      </div>

      <Card variant="borderless" className="ds-page-card deliverable-selector-card">
        <div className="card-title-row with-action">
          <div><h3>选择要生成的服务材料</h3><Text type="secondary">AI 会先引用客户事实，再生成可编辑初稿</Text></div>
          <Segmented options={['专业版', '客户易读版']} defaultValue="专业版" />
        </div>
        <div className="deliverable-grid">
          {deliverables.map((item) => (
            <button
              type="button"
              key={item.key}
              className={`deliverable-card ${activeType === item.key ? 'is-active' : ''}`}
              onClick={() => selectDeliverable(item.key)}
            >
              <span className="deliverable-icon">{deliverableIcons[item.key]}</span>
              <span><strong>{item.title}</strong><small>{item.subtitle}</small></span>
              {generated.has(item.key) && <CheckCircleFilled className="generated-check" />}
            </button>
          ))}
        </div>
      </Card>

      <div className="generation-grid">
        <Card variant="borderless" className="ds-page-card generation-control-card">
          <div className="card-title-row"><div><h3>生成设置</h3><Text type="secondary">预置模板可直接使用，也可以补充顾问判断</Text></div></div>
          <label className="field-label">生成模板</label>
          <Select
            defaultValue="风险事件跟进"
            options={[
              { value: '风险事件跟进', label: '风险事件跟进 · 标准模板' },
              { value: '产品到期服务', label: '产品到期服务 · 标准模板' },
              { value: '客户主动咨询', label: '客户主动咨询 · 快速模板' },
            ]}
          />
          <label className="field-label">AI 指令</label>
          <TextArea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={9} />
          <div className="source-summary">
            <strong><DatabaseOutlined /> 将引用 6 类数据</strong>
            <div><span>账户持仓</span><span>风险测评</span><span>交易流水</span><span>沟通纪要</span><span>产品资料</span><span>市场数据</span></div>
          </div>
          <Alert type="info" showIcon title="生成内容不会自动发送或执行，必须由顾问审核确认。" />
          <Button type="primary" size="large" block className="generate-button" icon={generating ? <RobotOutlined /> : <ThunderboltFilled />} loading={generating} onClick={generate}>
            {generated.has(activeType) ? `重新生成${activeDeliverable.title}` : `生成${activeDeliverable.title}`}
          </Button>
          {generating && <Progress percent={progress} strokeColor={{ '0%': '#6b5cff', '100%': '#2fb8c6' }} status="active" />}
        </Card>

        <Card variant="borderless" className="ds-page-card generation-result-card">
          <div className="result-header">
            <div>
              <div className="result-title"><RobotOutlined /> {activeDeliverable.title} <Tag variant="filled" className="ai-status-tag">AI 初稿</Tag></div>
              <Text type="secondary">已基于 6 类业务数据生成 · 最后更新 09:26</Text>
            </div>
            <Space size={4}>
              <Button type="text" icon={<CopyOutlined />}>复制</Button>
              <Button type="text" icon={<ExportOutlined />}>导出</Button>
              <Button type="text" icon={<EditOutlined />}>编辑</Button>
            </Space>
          </div>
          <Divider />
          {generating ? (
            <div className="generation-thinking-state">
              <div className="large-ai-orb"><RobotOutlined /></div>
              <h3>正在核对客户事实并生成内容</h3>
              <p>风险判断 → 适当性约束 → 行动建议 → 合规表述</p>
            </div>
          ) : generated.has(activeType) ? deliverableOutput() : (
            <div className="generation-empty-state">
              <RobotOutlined />
              <h3>准备生成{activeDeliverable.title}</h3>
              <p>检查左侧客户上下文与指令，生成后可继续编辑、复制或保存到客户档案。</p>
              <Button type="primary" className="ai-primary-button" onClick={generate}>开始生成</Button>
            </div>
          )}
          {!generating && generated.has(activeType) && (
            <div className="result-action-bar">
              <Text type="secondary"><CheckCircleFilled /> 已通过敏感词与收益承诺检查</Text>
              <Space>
                <Button icon={<ReloadOutlined />} onClick={generate}>重新生成</Button>
                <Button type="primary" icon={<SendOutlined />} className="ai-primary-button" onClick={() => setArchiveOpen(true)}>审核并用于跟进</Button>
              </Space>
            </div>
          )}
        </Card>
      </div>

      <Modal
        open={archiveOpen}
        title="确认完成本次服务准备"
        centered
        width={560}
        onCancel={() => setArchiveOpen(false)}
        okText="确认并保存客户档案"
        cancelText="继续检查"
        onOk={() => {
          setArchived(true)
          setArchiveOpen(false)
        }}
      >
        <Steps
          orientation="vertical"
          size="small"
          current={3}
          items={[
            { title: '风险与事实已确认', content: '持仓、测评与流动性需求已核对' },
            { title: '服务材料已生成', content: '服务建议、沟通提纲和客户报告' },
            { title: '顾问已完成人工审核', content: '未发现收益承诺或不当产品推荐' },
            { title: '保存客户档案 并创建任务', content: '创建 9 月 19 日客户反馈跟进任务' },
          ]}
        />
        <Alert type="warning" showIcon title="确认后会保存当前版本，并创建后续任务；不会自动向客户发送内容。" />
      </Modal>
    </div>
  )
}
