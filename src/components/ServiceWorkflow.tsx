import { CheckCircleFilled, CopyOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Card, Input, Radio, Select, Spin, Steps } from 'antd'
import { useEffect, useRef, useState } from 'react'
import type { RiskAlert } from '../types'

type Plan = { title: string }

interface ServiceWorkflowProps {
  clientId: string
  name: string
  risk?: RiskAlert
  embedded?: boolean
  onComplete?: () => void
}

export function ServiceWorkflow({ clientId, name, risk, onComplete }: ServiceWorkflowProps) {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(0)
  const [focus, setFocus] = useState('先核实他行可调度资金及到账时间')
  const [channel, setChannel] = useState('电话')
  const [tone, setTone] = useState('稳健清晰，不预设客户选择')
  const [generating, setGenerating] = useState(false)
  const [script, setScript] = useState('')
  const [copied, setCopied] = useState(false)
  const [previewed, setPreviewed] = useState('')
  const [outcome, setOutcome] = useState('客户希望进一步评估')
  const [notes, setNotes] = useState('')
  const [nextDate, setNextDate] = useState('2026-09-22')
  const timerRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
  }, [])

  const isLiquidityCase = clientId === 'diaz'
  const plans: Plan[] = isLiquidityCase ? [
    { title: '方案一：优先核实他行资金' },
    { title: '方案二：评估赎回低波动资产' },
    { title: '方案三：组合安排多笔资金' },
  ] : [
    { title: '方案一：先核实客户当前需求' },
    { title: '方案二：评估分阶段调整路径' },
    { title: '方案三：建立观察与复核计划' },
  ]

  const context = isLiquidityCase
    ? '10 月 9 日需支付购房尾款 25 万元；当前可用资金 8.2 万元，预计缺口 16.8 万元。他行资产金额与实际到账时间仍需客户确认。'
    : `${risk?.summary || '需要进行季度服务回顾'}。影响范围为 ${risk?.impactValue || '待核实'}，相关事实仍需与客户确认。`

  const createScript = () => {
    const salutation = `${name[0]}${['lauren', 'emily', 'chen-family', 'zhang-family', 'li-family'].includes(clientId) ? '女士' : '先生'}`
    setScript(`${salutation}，您好，我是您的客户经理顾明远。想提前和您核实一项近期资金安排，避免临近付款时准备仓促。\n\n根据现有记录，${context}\n\n这次想先和您确认三件事：第一，付款金额和日期是否有变化；第二，他行目前可调度的资金和预计到账时间；第三，您是否希望优先保留现有投资持仓。\n\n在信息确认后，我会基于您选择的“${plans[selected].title.replace(/^方案[一二三]：/, '')}”方向整理可比较的资金安排，再与您确认下一步。以上只用于讨论，不会自动触发交易。`)
  }

  const generate = () => {
    setGenerating(true)
    timerRef.current = window.setTimeout(() => {
      createScript()
      setGenerating(false)
      setStep(1)
    }, 2000)
  }

  const regenerate = () => {
    setGenerating(true)
    timerRef.current = window.setTimeout(() => {
      createScript()
      setGenerating(false)
    }, 2000)
  }

  const copyScript = async () => {
    await navigator.clipboard?.writeText(script)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  const saveRecord = () => {
    setStep(3)
    onComplete?.()
  }

  const materials = [
    '客户资产与风险摘要.pdf',
    '资金安排方案对比.pdf',
    '沟通提纲与待确认事项.docx',
  ]

  return (
    <Card variant="borderless" className="service-workflow">
      <div className="workflow-progress">
        <Steps
          size="small"
          responsive={false}
          current={step}
          items={['确定方向', '生成方案', '保存纪要'].map((title) => ({ title }))}
        />
      </div>

      <div className="workflow-panel-body">
        {generating && (
          <div className="workflow-generating">
            <Spin size="large" />
            <strong>AI 正在生成跟进方案</strong>
            <span>正在结合客户资产、风险依据和沟通偏好整理内容…</span>
          </div>
        )}

        {!generating && step === 0 && <>
          <section className="workflow-evidence-plain">
            <h3>查看分析依据</h3>
            <p>{context}</p>
            <p>分析范围包含本机构账户、现金流、客户资料与历史沟通记录；他行资金以客户最新确认为准。</p>
          </section>

          <section className="workflow-direction-section">
            <h3>选择方向</h3>
            <div className="workflow-direction-list">
              {plans.map((plan, index) => (
                <button type="button" key={plan.title} aria-pressed={selected === index} className={selected === index ? 'selected' : ''} onClick={() => setSelected(index)}>{plan.title}</button>
              ))}
            </div>
          </section>

          <div className="workflow-preferences">
            <label>本次沟通重点<Input value={focus} onChange={(event) => setFocus(event.target.value)} /></label>
            <label>沟通方式<Select value={channel} onChange={setChannel} options={['电话', '企业微信', '线下会面'].map((value) => ({ value, label: value }))} /></label>
            <label>表达口径<Select value={tone} onChange={setTone} options={['稳健清晰，不预设客户选择', '温和解释，先听取客户想法', '简洁直接，突出待确认事项'].map((value) => ({ value, label: value }))} /></label>
          </div>
        </>}

        {!generating && step === 1 && <>
          <section className="workflow-result-section">
            <div className="workflow-result-heading">
              <div><h3>沟通文案</h3><span>已按“{tone}”生成，可复制后使用</span></div>
              <div><Button size="small" icon={<ReloadOutlined />} onClick={regenerate}>重新生成</Button><Button size="small" icon={<CopyOutlined />} onClick={copyScript}>{copied ? '已复制' : '复制'}</Button></div>
            </div>
            <div className="workflow-script">{script}</div>
          </section>

          <section className="workflow-materials-section">
            <h3>材料清单</h3>
            <div className="workflow-materials-list">
              {materials.map((material) => (
                <div key={material}><FileTextOutlined /><span>{material}</span><Button type="link" size="small" onClick={() => setPreviewed(material)}>{previewed === material ? '已预览' : '预览'}</Button></div>
              ))}
            </div>
          </section>
        </>}

        {!generating && step === 2 && <div className="workflow-record-form">
          <label>沟通结果
            <Radio.Group value={outcome} onChange={(event) => setOutcome(event.target.value)}>
              <Radio value="客户希望进一步评估">客户希望进一步评估</Radio>
              <Radio value="客户已确认方案方向">客户已确认方案方向</Radio>
              <Radio value="客户暂不处理">客户暂不处理</Radio>
              <Radio value="未接通">未接通</Radio>
            </Radio.Group>
          </label>
          <label>沟通记录<Input.TextArea value={notes} onChange={(event) => setNotes(event.target.value)} rows={6} placeholder="记录客户反馈、确认事项和后续安排" /></label>
          <label>下次跟进日期<Input type="date" value={nextDate} onChange={(event) => setNextDate(event.target.value)} /></label>
        </div>}

        {!generating && step === 3 && <div className="workflow-complete-state">
          <CheckCircleFilled />
          <h3>风险跟进已完成</h3>
          <p>沟通结果和下次跟进日期已保存，客户详情中的风险状态已同步更新。</p>
        </div>}
      </div>

      {!generating && step < 3 && <div className="workflow-panel-footer">
        {step > 0 && <Button onClick={() => setStep((current) => current - 1)}>返回上一步</Button>}
        {step === 0 && <Button type="primary" className="ai-workflow-button workflow-primary-action" onClick={generate}>生成跟进方案</Button>}
        {step === 1 && <Button type="primary" className="workflow-primary-action" onClick={() => setStep(2)}>填写沟通结果</Button>}
        {step === 2 && <Button type="primary" className="workflow-primary-action" disabled={!notes.trim() || !nextDate} onClick={saveRecord}>保存纪要</Button>}
      </div>}
    </Card>
  )
}
