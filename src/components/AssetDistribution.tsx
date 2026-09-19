import { Area } from '@ant-design/charts'
import { theme } from 'antd'
import { useMemo } from 'react'
const distribution = [
  { range: '50万以下', clients: 8 }, { range: '50–100万', clients: 22 },
  { range: '100–200万', clients: 15 }, { range: '200–500万', clients: 39 },
  { range: '500–1,000万', clients: 24 }, { range: '1,000–2,000万', clients: 28 },
  { range: '2,000–5,000万', clients: 9 }, { range: '5,000万以上', clients: 8 },
]
export function AssetDistribution() {
  const { token } = theme.useToken()
  const config = useMemo(() => ({
    data: distribution, xField: 'range', yField: 'clients', height: 280, autoFit: true, paddingRight: 64,
    scale: { y: { domain: [0, 50], nice: true } },
    style: { fill: 'l(270) 0:rgba(22,119,255,0.02) 1:rgba(22,119,255,0.28)' },
    line: { style: { stroke: token.colorPrimary, lineWidth: 2 } },
    axis: { x: { title: false, labelFontSize: 12, labelAutoRotate: false }, y: { title: false, labelFontSize: 12, labelFormatter: (value: number) => `${value} 人`, gridLineDash: [4, 4] } },
    tooltip: { title: 'range', items: [{ field: 'clients', name: '客户数', valueFormatter: (value: number) => `${value} 人` }] },
    interaction: { tooltip: { marker: true } },
  }), [token.colorPrimary])
  return <section className="analytics-section asset-distribution-section" aria-label="客户资产规模分布">
    <div className="distribution-heading"><h3>客户资产规模分布</h3><span className="distribution-unit">金额单位：人民币</span></div>
    <div className="distribution-summary"><span><i />客户数分布</span><span>客户最集中区间 <strong>200–500 万元</strong></span><span>该区间 <strong>39 位客户</strong><span> · 25.5%</span></span></div>
    <Area {...config} />
  </section>
}
