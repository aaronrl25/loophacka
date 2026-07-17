interface SparklineProps {
  data: number[]
  /** Stroke color; defaults to currentColor so the parent can tint it. */
  color?: string
  width?: number
  height?: number
}

// A bare 12-point sparkline: 2px line in a de-emphasis hue with the current
// point marked. No axes — it reads as texture beside the stat value.
function Sparkline({
  data,
  color = 'currentColor',
  width = 96,
  height = 32,
}: SparklineProps) {
  if (data.length < 2) return null

  const pad = 3
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = (width - pad * 2) / (data.length - 1)

  const points = data.map((v, i) => {
    const x = pad + i * stepX
    const y = pad + (1 - (v - min) / range) * (height - pad * 2)
    return [x, y] as const
  })

  const d = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const [lastX, lastY] = points[points.length - 1]

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      role="presentation"
      aria-hidden="true"
    >
      <path d={d} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
      <circle cx={lastX} cy={lastY} r={3} fill={color} />
    </svg>
  )
}

export default Sparkline
