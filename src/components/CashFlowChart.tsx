import { useId, useMemo, useState } from 'react'
import type { CashFlowPoint } from '../types'
import { formatCurrency } from '../lib/format'
import './CashFlowChart.css'

interface CashFlowChartProps {
  data: CashFlowPoint[]
}

const W = 720
const H = 260
const PAD = { top: 16, right: 20, bottom: 28, left: 52 }

function niceCeil(v: number, step: number): number {
  return Math.ceil(v / step) * step
}
function niceFloor(v: number, step: number): number {
  return Math.floor(v / step) * step
}

function CashFlowChart({ data }: CashFlowChartProps) {
  const clipId = useId()
  const [hover, setHover] = useState<number | null>(null)

  const geom = useMemo(() => {
    const values = data.flatMap((d) => [d.projected, ...(d.actual != null ? [d.actual] : [])])
    const step = 2_000_000
    const min = niceFloor(Math.min(...values), step)
    const max = niceCeil(Math.max(...values), step)
    const range = max - min || 1

    const plotW = W - PAD.left - PAD.right
    const plotH = H - PAD.top - PAD.bottom
    const stepX = plotW / (data.length - 1)

    const x = (i: number) => PAD.left + i * stepX
    const y = (v: number) => PAD.top + (1 - (v - min) / range) * plotH

    const ticks: number[] = []
    for (let t = min; t <= max; t += step) ticks.push(t)

    // Where actuals end and the forecast begins.
    const lastActualIdx = data.reduce((acc, d, i) => (d.actual != null ? i : acc), 0)

    const actualPts = data
      .map((d, i) => (d.actual != null ? [x(i), y(d.actual)] : null))
      .filter((p): p is number[] => p !== null)
    const projectedPts = data.map((d, i) => [x(i), y(d.projected)])

    const line = (pts: number[][]) =>
      pts.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ')

    return { x, y, min, max, stepX, plotH, ticks, lastActualIdx, actualPts, projectedPts, line }
  }, [data])

  const forecastX = geom.x(geom.lastActualIdx)
  const active = hover != null ? data[hover] : null

  return (
    <figure className="cashflow">
      <div className="cashflow__head">
        <div>
          <h3 className="cashflow__title">Cash runway</h3>
          <p className="cashflow__sub">Closing cash balance · actual and Loopy&rsquo;s projection</p>
        </div>
        <div className="cashflow__legend" aria-hidden="true">
          <span className="cashflow__key">
            <span className="cashflow__swatch cashflow__swatch--solid" /> Actual
          </span>
          <span className="cashflow__key">
            <span className="cashflow__swatch cashflow__swatch--dashed" /> Projected
          </span>
        </div>
      </div>

      <svg
        className="cashflow__svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Cash balance over time, actual and projected"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const svgX = ((e.clientX - rect.left) / rect.width) * W
          const i = Math.round((svgX - PAD.left) / geom.stepX)
          setHover(Math.max(0, Math.min(data.length - 1, i)))
        }}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={forecastX} y={0} width={W - forecastX} height={H} />
          </clipPath>
        </defs>

        {/* Forecast region shading */}
        <rect
          className="cashflow__forecast-bg"
          x={forecastX}
          y={PAD.top}
          width={W - PAD.right - forecastX}
          height={geom.plotH}
        />

        {/* Gridlines + y ticks */}
        {geom.ticks.map((t) => (
          <g key={t}>
            <line
              className="cashflow__grid"
              x1={PAD.left}
              x2={W - PAD.right}
              y1={geom.y(t)}
              y2={geom.y(t)}
            />
            <text className="cashflow__ytick" x={PAD.left - 8} y={geom.y(t) + 4} textAnchor="end">
              {formatCurrency(t)}
            </text>
          </g>
        ))}

        {/* X labels */}
        {data.map((d, i) => (
          <text
            key={d.month}
            className="cashflow__xtick"
            x={geom.x(i)}
            y={H - 8}
            textAnchor="middle"
          >
            {d.month}
          </text>
        ))}

        {/* Projected line — full range, dashed under forecast */}
        <path className="cashflow__line cashflow__line--proj" d={geom.line(geom.projectedPts)} />
        {/* Solid over the historical part to sit under the actual line cleanly */}
        <path
          className="cashflow__line cashflow__line--proj-past"
          d={geom.line(geom.projectedPts)}
          clipPath={`url(#${clipId})`}
        />

        {/* Actual line — solid */}
        <path className="cashflow__line cashflow__line--actual" d={geom.line(geom.actualPts)} />

        {/* Forecast start divider */}
        <line
          className="cashflow__divider"
          x1={forecastX}
          x2={forecastX}
          y1={PAD.top}
          y2={H - PAD.bottom}
        />

        {/* Hover crosshair + markers */}
        {active && (
          <g>
            <line
              className="cashflow__crosshair"
              x1={geom.x(hover!)}
              x2={geom.x(hover!)}
              y1={PAD.top}
              y2={H - PAD.bottom}
            />
            {active.actual != null && (
              <circle className="cashflow__dot cashflow__dot--actual" cx={geom.x(hover!)} cy={geom.y(active.actual)} r={4} />
            )}
            <circle className="cashflow__dot cashflow__dot--proj" cx={geom.x(hover!)} cy={geom.y(active.projected)} r={4} />
          </g>
        )}
      </svg>

      {active && (
        <div
          className="cashflow__tooltip"
          style={{ left: `${(geom.x(hover!) / W) * 100}%` }}
        >
          <div className="cashflow__tt-month">{active.month} 2026</div>
          {active.actual != null && (
            <div className="cashflow__tt-row">
              <span className="cashflow__swatch cashflow__swatch--solid" /> Actual
              <strong>{formatCurrency(active.actual)}</strong>
            </div>
          )}
          <div className="cashflow__tt-row">
            <span className="cashflow__swatch cashflow__swatch--dashed" /> Projected
            <strong>{formatCurrency(active.projected)}</strong>
          </div>
        </div>
      )}
    </figure>
  )
}

export default CashFlowChart
