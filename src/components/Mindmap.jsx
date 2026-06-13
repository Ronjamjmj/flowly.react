import React, { useEffect, useRef, useState } from 'react';

const dc = { 1: '#70B07A', 2: '#C8A050', 3: '#C8861E', 4: '#C07040', 5: '#B04040' };
const gc = d => dc[d] || '#9A9080';

export default function Mindmap({ subject, onGoView, onOpenConcept }) {
  const svgRef = useRef(null);
  const bodyRef = useRef(null);
  const [dims, setDims] = useState({ w: 800, h: 500 });

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const update = () => setDims({ w: el.clientWidth || 800, h: el.clientHeight || 500 });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [subject?.id]);

  if (!subject) return null;

  const { w: W, h: H } = dims;
  const cx = W / 2, cy = H / 2, n = subject.concepts.length;
  const R = Math.min(W, H) * 0.3, NR = 45;

  const nodes = subject.concepts.map((c, i) => ({
    ...c,
    x: cx + R * Math.cos((2 * Math.PI * i / n) - Math.PI / 2),
    y: cy + R * Math.sin((2 * Math.PI * i / n) - Math.PI / 2)
  }));

  return (
    <div className="map-shell">
      <div className="map-hd">
        <div className="map-ico">{subject.icon}</div>
        <div>
          <div className="map-tt">{subject.title}</div>
          <div className="map-sub">{subject.folder} · {subject.concepts.length} Konzepte — Konzept anklicken</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn-s" onClick={() => onGoView('dash')}>← Dashboard</button>
        </div>
      </div>
      <div className="map-body" ref={bodyRef}>
        <svg className="map-svg" ref={svgRef} xmlns="http://www.w3.org/2000/svg">
          {nodes.map(nd => (
            <line key={'l' + nd.id} className="mn-line" x1={cx} y1={cy} x2={nd.x} y2={nd.y} />
          ))}
          <ellipse className="mn-center-bg" cx={cx} cy={cy} rx="63" ry="27" />
          <text className="mn-center-t" x={cx} y={cy}>
            {subject.title.length > 14 ? subject.title.slice(0, 14) + '…' : subject.title}
          </text>
          {nodes.map(nd => {
            const col = gc(nd.diff), rr = NR - 5, C2 = 2 * Math.PI * rr, fi = C2 * nd.mem;
            return (
              <g className="mn-node" key={nd.id} onClick={() => onOpenConcept(subject.id, nd.id)}>
                <circle className="mn-bg" cx={nd.x} cy={nd.y} r={NR} fill={col + '1E'} stroke={col + '55'} strokeWidth="1.5" />
                <circle className="mn-ring-bg" cx={nd.x} cy={nd.y} r={rr} stroke={col} transform={`rotate(-90 ${nd.x} ${nd.y})`} />
                <circle className="mn-ring-fill" cx={nd.x} cy={nd.y} r={rr} stroke={col}
                  strokeDasharray={`${fi.toFixed(1)} ${C2.toFixed(1)}`} transform={`rotate(-90 ${nd.x} ${nd.y})`} />
                <text className="mn-label" x={nd.x} y={nd.y + 3}>
                  {nd.title.length > 11 ? nd.title.slice(0, 11) + '…' : nd.title}
                </text>
                <text className="mn-sub" x={nd.x} y={nd.y + 16}>{Math.round(nd.mem * 100)}%</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
