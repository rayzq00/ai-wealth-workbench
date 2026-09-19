import { CopyOutlined, MailOutlined, MessageOutlined, PhoneOutlined } from '@ant-design/icons'
import { Button, Card, Modal, Tag } from 'antd'
import { useState } from 'react'
import wealthLogo from '../../asset/logo.svg'
import type { RiskAlert } from '../types'

interface ContactClientModalProps {
  open: boolean
  onClose: () => void
  name: string
  risk?: RiskAlert | null
}

export function ContactClientModal({ open, onClose, name, risk }: ContactClientModalProps) {
  const [copied, setCopied] = useState('')
  const contactItems = [
    { label: '手机号码', value: '138 6298 2658', icon: <PhoneOutlined /> },
    { label: '企业微信', value: `${name} · 已添加`, icon: <MessageOutlined /> },
    { label: '电子邮箱', value: 'qiming.zhou@example.cn', icon: <MailOutlined /> },
  ]

  const copy = async (label: string, value: string) => {
    await navigator.clipboard?.writeText(value)
    setCopied(label)
    window.setTimeout(() => setCopied(''), 1400)
  }

  return (
    <Modal
      centered
      width={520}
      open={open}
      title={`联系客户 · ${name}`}
      onCancel={onClose}
      footer={<Button onClick={onClose}>关闭</Button>}
      destroyOnHidden
      className="contact-client-modal"
    >
      <div className="contact-method-list">
        {contactItems.map((item) => (
          <div className="contact-method-row" key={item.label}>
            <span className="contact-method-icon">{item.icon}</span>
            <span><small>{item.label}</small><strong>{item.value}</strong></span>
            <Button size="small" icon={<CopyOutlined />} onClick={() => copy(item.label, item.value)}>{copied === item.label ? '已复制' : '复制'}</Button>
          </div>
        ))}
      </div>

      <Card variant="borderless" className="ai-brief-card ai-summary-card contact-ai-card">
        <div className="ai-summary-heading">
          <span className="ai-summary-mark"><img src={wealthLogo} alt="" /></span>
          <h2>AI 沟通提示</h2>
          <Tag color="purple" variant="filled">通话大纲</Tag>
        </div>
        <ul>
          <li>先确认客户现在是否方便沟通，并说明本次联系是为了提前核实近期资金安排。</li>
          <li>{risk ? `核实“${risk.summary}”涉及的金额、时间及客户已经准备的资金来源。` : '询问客户近期资金用途、服务需求以及资产安排是否发生变化。'}</li>
          <li>避免直接预设客户会选择某个方案；先确认事实和偏好，再约定下一次方案确认时间。</li>
        </ul>
      </Card>
    </Modal>
  )
}
