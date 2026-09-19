import { assetMix } from '../data'

interface AssetDonutProps {
  compact?: boolean
}

export function AssetDonut({ compact = false }: AssetDonutProps) {
  const circumference = 2 * Math.PI * 46

  return (
    <div className={`asset-donut-wrap ${compact ? 'is-compact' : ''}`}>
      <div className="asset-donut" role="img" aria-label="客户资产配置分布">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="donut-track" cx="60" cy="60" r="46" />
          {assetMix.map((item, index) => {
            const length = (item.value / 100) * circumference
            const offset = assetMix
              .slice(0, index)
              .reduce((sum, segment) => sum + segment.value, 0)

            return (
              <circle
                key={item.label}
                className="donut-segment"
                cx="60"
                cy="60"
                r="46"
                stroke={item.color}
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-(offset / 100) * circumference}
              />
            )
          })}
        </svg>
        <div className="donut-center">
          <strong>{compact ? '1,286' : '7.224'}</strong>
          <span>{compact ? '万元' : '亿元'}</span>
        </div>
      </div>

      <div className="asset-legend">
        {assetMix.map((item) => (
          <div className="asset-legend-row" key={item.label}>
            <span className="legend-dot" style={{ background: item.color }} />
            <span>{item.label}</span>
            <strong>{item.value}%</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
