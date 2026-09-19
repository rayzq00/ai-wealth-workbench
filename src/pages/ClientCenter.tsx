import {
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Progress,
  Select,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { wealthClients } from '../data'
import type { ClientDirectoryStatus, WealthClient } from '../types'
import { CustomerAvatar } from '../components/CustomerAvatar'

const { Title } = Typography

type ClientFilter = '全部' | '我的客户' | '高净值客户' | '存在风险' | '需关注'

interface ClientCenterProps {
  onOpenClient: (clientId: string) => void
}

const statusColor: Record<ClientDirectoryStatus, string> = {
  风险关注: 'error',
  正常服务: 'success',
  需跟进: 'warning',
}

export function ClientCenter({ onOpenClient }: ClientCenterProps) {
  const [filter, setFilter] = useState<ClientFilter>('全部')
  const [query, setQuery] = useState('')
  const [addOpen, setAddOpen] = useState(false)

  const clients = useMemo(() => wealthClients.filter((client) => {
    const matchesQuery = !query || `${client.name}${client.clientNo}${client.segment}`.toLowerCase().includes(query.trim().toLowerCase())
    const matchesFilter = filter === '全部'
      || (filter === '我的客户' && client.isMine)
      || (filter === '高净值客户' && client.segment === '高净值客户')
      || (filter === '存在风险' && client.status === '风险关注')
      || (filter === '需关注' && client.status === '需跟进')
    return matchesQuery && matchesFilter
  }), [filter, query])

  const countFor = (key: ClientFilter) => wealthClients.filter((client) => (
    key === '全部'
    || (key === '我的客户' && client.isMine)
    || (key === '高净值客户' && client.segment === '高净值客户')
    || (key === '存在风险' && client.status === '风险关注')
    || (key === '需关注' && client.status === '需跟进')
  )).length

  const columns: ColumnsType<WealthClient> = [
    {
      title: '客户姓名',
      dataIndex: 'name',
      width: '22%',
      render: (_, client) => (
        <div className="client-name-cell">
          <CustomerAvatar name={client.name} />
          <div><button className="client-name-link" onClick={(event) => { event.stopPropagation(); onOpenClient(client.id) }}>{client.name}</button><span>{client.clientNo} · {client.segment}</span></div>
        </div>
      ),
    },
    { title: '管理资产', dataIndex: 'aum', width: '12%', render: (value: string) => <strong className="client-aum">{value}</strong> },
    {
      title: '本机构资产占比',
      dataIndex: 'walletShare',
      width: '18%',
      render: (value: number) => <div className="wallet-share-cell"><Progress percent={value} size="small" showInfo={false} /><b>{value}%</b></div>,
    },
    { title: '状态', dataIndex: 'status', width: '10%', render: (value: ClientDirectoryStatus) => <Tag color={statusColor[value]} variant="filled" className={value === '正常服务' ? 'success-tag' : undefined}>{value}</Tag> },
    { title: '最近联系', dataIndex: 'recentContact', width: '11%' },
    { title: '下一步行动', dataIndex: 'nextAction', width: '17%', ellipsis: true },
    {
      title: '操作',
      key: 'action',
      width: '10%',
      align: 'center',
      render: (_, client) => (
        <Button
          size="small"
          onClick={(event) => { event.stopPropagation(); onOpenClient(client.id) }}
        >查看详情</Button>
      ),
    },
  ]

  const filters: ClientFilter[] = ['全部', '我的客户', '高净值客户', '存在风险', '需关注']

  return (
    <div className="ds-page-shell client-center-page">
      <div className="ds-page-header client-center-header">
        <Title level={4} className="ds-page-title">客户中心</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddOpen(true)}>新增客户</Button>
      </div>

      <Card variant="borderless" className="ds-page-card client-directory-card">
        <div className="client-directory-toolbar">
          <Tabs
            className="client-filter-tabs"
            activeKey={filter}
            onChange={(key) => setFilter(key as ClientFilter)}
            items={filters.map((key) => ({ key, label: <span>{key}<b>{countFor(key)}</b></span> }))}
          />
          <Input allowClear prefix={<SearchOutlined />} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索客户姓名、编号或客户类型" />
        </div>
        <Table<WealthClient>
          rowKey="id"
          columns={columns}
          dataSource={clients}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          onRow={(client) => ({ onClick: () => onOpenClient(client.id) })}
          rowClassName="client-directory-row"
          tableLayout="fixed"
        />
      </Card>

      <Modal title="新增客户" open={addOpen} onCancel={() => setAddOpen(false)} onOk={() => setAddOpen(false)} okText="创建客户" cancelText="取消">
        <Form layout="vertical" className="add-client-form">
          <Form.Item label="客户姓名" required><Input placeholder="请输入名称" /></Form.Item>
          <Form.Item label="客户类型" required><Select placeholder="请选择" options={['高净值客户', '富裕客户', '成长客户', '私行客户'].map((value) => ({ value, label: value }))} /></Form.Item>
          <Form.Item label="负责顾问"><Input value="顾明远" readOnly /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
