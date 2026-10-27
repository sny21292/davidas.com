// Server-rendered SVG donut chart (no chart library). Segments are drawn with
// stroke-dasharray on concentric circle arcs.
export type DonutSegment = { label: string; value: number; color: string };

export default function Donut({
  segments,
  centerNum,
  centerSub,
}: {
  segments: DonutSegment[];
  centerNum: string;
  centerSub: string;
}) {
  const total = Math.max(1, segments.reduce((s, x) => s + x.value, 0));
  const r = 54;
  const C = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg viewBox="0 0 140 140" className="admin-donut" role="img" aria-label={centerSub}>
      <g transform="rotate(-90 70 70)">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#eef0ea" strokeWidth="17" />
        {segments.map((s) => {
          const len = (s.value / total) * C;
          const el = (
            <circle
              key={s.label}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="17"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </g>
      <text x="70" y="72" textAnchor="middle" className="admin-donut__num">{centerNum}</text>
      <text x="70" y="88" textAnchor="middle" className="admin-donut__sub">{centerSub}</text>
    </svg>
  );
}
