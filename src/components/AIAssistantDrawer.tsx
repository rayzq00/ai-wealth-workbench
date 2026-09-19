import { CloseOutlined, SendOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import { useEffect, useRef, useState } from 'react'
import wealthLogo from '../../asset/logo.svg'
import type { ChatMessage } from '../types'

const { TextArea } = Input

interface AIAssistantDrawerProps {
  open: boolean
  onClose: () => void
}

const suggestions = [
  '为什么周启明需要优先联系？',
  '今天有哪些客户需要跟进？',
  '帮我准备周启明的沟通提纲',
]

export function AIAssistantDrawer({ open, onClose }: AIAssistantDrawerProps) {
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content: '顾经理，您好。你可以问我风险原因、客户背景，或让我准备跟进材料。',
    },
  ])
  const timerRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
  }, [])

  const send = (text = input) => {
    const trimmed = text.trim()
    if (!trimmed || thinking) return

    setMessages((current) => [...current, { id: Date.now(), role: 'user', content: trimmed }])
    setInput('')
    setThinking(true)

    timerRef.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content:
            trimmed.includes('周启明') || trimmed.includes('优先')
              ? '周启明需要在 10 月 9 日支付 25 万元购房尾款，本机构账户当前可用资金为 8.2 万元，预计缺口 16.8 万元。建议先确认付款日期和他行可用资金，再核实理财或基金的赎回到账时间。相关信息需与客户确认。'
              : '我已基于客户档案、持仓、交易流水和历史沟通记录完成整理。建议先从高风险与 3 日内到期事项开始，我可以继续生成逐户沟通提纲。',
        },
      ])
      setThinking(false)
    }, 700)
  }

  if (!open) return null

  return (
    <aside className="ai-assistant-panel" aria-label="AI 助手面板">
      <div className="assistant-header">
        <div className="assistant-identity">
          <div className="assistant-avatar"><img src={wealthLogo} alt="" /></div>
          <strong>曜见 AI 助手</strong>
        </div>
        <Button type="text" icon={<CloseOutlined />} onClick={onClose} aria-label="关闭" />
      </div>

      <div className="assistant-messages">
        {messages.map((message) => (
          <div key={message.id} className={`chat-message ${message.role}`}>
            <div className="chat-bubble">{message.content}</div>
          </div>
        ))}
        {thinking && (
          <div className="chat-message assistant">
            <div className="chat-bubble thinking-dots"><i /><i /><i /></div>
          </div>
        )}
      </div>

      <div className="assistant-composer">
        <div className="assistant-suggestions">
          {suggestions.map((item) => <button type="button" key={item} onClick={() => send(item)}>{item}</button>)}
        </div>
        <div className="composer-box">
          <TextArea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onPressEnter={(event) => {
              if (!event.shiftKey) {
                event.preventDefault()
                send()
              }
            }}
            autoSize={{ minRows: 2, maxRows: 4 }}
            placeholder="询问客户、风险或让 AI 准备材料…"
          />
          <div className="composer-footer">
            <Button type="primary" className="ai-primary-button" shape="circle" icon={<SendOutlined />} onClick={() => send()} disabled={!input.trim()} />
          </div>
        </div>
      </div>
    </aside>
  )
}
