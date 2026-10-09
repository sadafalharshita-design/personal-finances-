import React, { useState } from 'react';
import { ProjectionPoint } from '../../types/finance';
import { formatINR } from '../common/FormatRupee';

interface ProjectionChartProps {
  data: ProjectionPoint[];
  height?: number;
}

export const ProjectionChart: React.FC<ProjectionChartProps> = ({ data, height = 280 }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-slate-500 text-sm">No projection data available</div>;
  }

  const padding = { top: 20, right: 30, bottom: 35, left: 65 };
  const width = 760; // internal coordinate system

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.baseline, d.simulated)),
    100000
  );
  // Round up max to nice step
  const yMax = Math.ceil(maxVal * 1.12);

  const getX = (index: number) => {
    const usableWidth = width - padding.left - padding.right;
    return padding.left + (index / (data.length - 1)) * usableWidth;
  };

  const getY = (val: number) => {
    const usableHeight = height - padding.top - padding.bottom;
    const norm = Math.max(0, val) / yMax;
    return height - padding.bottom - norm * usableHeight;
  };

  // Build SVG path strings
  const baselinePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(d.baseline).toFixed(1)}`)
    .join(' ');

  const simulatedPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(d.simulated).toFixed(1)}`)
    .join(' ');

  const areaPath = `${simulatedPath} L ${getX(data.length - 1).toFixed(1)} ${(
    height - padding.bottom
  ).toFixed(1)} L ${getX(0).toFixed(1)} ${(height - padding.bottom).toFixed(1)} Z`;

  // Grid steps (4 horizontal lines)
  const yTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];

  const activePoint = hoverIndex !== null ? data[hoverIndex] : data[data.length - 1];
  const activeX = hoverIndex !== null ? getX(hoverIndex) : getX(data.length - 1);
  const activeBaselineY = getY(activePoint.baseline);
  const activeSimulatedY = getY(activePoint.simulated);

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Legend & quick readouts */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3.5 h-[2px] bg-slate-400 border-b border-dashed border-slate-300" />
            <span className="text-slate-400">Baseline Trajectory</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3.5 h-[3px] bg-[#dfb66d] rounded-full" />
            <span className="text-[#dfb66d] font-medium">What-If Simulated</span>
          </div>
        </div>

        <div className="text-slate-400">
          Month {activePoint.month}:{' '}
          <span className="text-[#dfb66d] font-mono tabular-nums font-semibold">
            {formatINR(activePoint.simulated)}
          </span>{' '}
          vs{' '}
          <span className="text-slate-300 font-mono tabular-nums">
            {formatINR(activePoint.baseline)}
          </span>{' '}
          <span className="text-emerald-400 font-mono tabular-nums text-[11px]">
            (+{formatINR(activePoint.simulated - activePoint.baseline)})
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible cursor-crosshair"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id="simulatedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c99e52" stopOpacity="0.28" />
            <stop offset="90%" stopColor="#c99e52" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines & Y labels */}
        {yTicks.map((tick, idx) => {
          const y = getY(tick);
          return (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="rgba(255, 255, 255, 0.07)"
                strokeDasharray={idx === 0 ? 'none' : '3 3'}
              />
              <text
                x={padding.left - 10}
                y={y + 3.5}
                textAnchor="end"
                className="fill-slate-400 text-[10px] font-mono tabular-nums"
              >
                {formatINR(tick, true)}
              </text>
            </g>
          );
        })}

        {/* Gradient fill under simulated line */}
        <path d={areaPath} fill="url(#simulatedGradient)" />

        {/* Baseline Line (dashed) */}
        <path
          d={baselinePath}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.8"
          strokeDasharray="5 5"
        />

        {/* Simulated Line (solid champagne brass) */}
        <path
          d={simulatedPath}
          fill="none"
          stroke="#dfb66d"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Month tick marks on X-axis */}
        {data.map((d, i) => {
          const x = getX(i);
          return (
            <g key={i}>
              <text
                x={x}
                y={height - 10}
                textAnchor="middle"
                className={`text-[10px] font-mono tabular-nums transition-colors ${
                  hoverIndex === i ? 'fill-[#dfb66d] font-bold' : 'fill-slate-500'
                }`}
              >
                {d.month}m
              </text>
            </g>
          );
        })}

        {/* Active hover crosshair vertical guide */}
        <line
          x1={activeX}
          y1={padding.top}
          x2={activeX}
          y2={height - padding.bottom}
          stroke="rgba(201, 158, 82, 0.35)"
          strokeWidth="1.2"
          strokeDasharray="2 2"
        />

        {/* Simulated active dot */}
        <circle
          cx={activeX}
          cy={activeSimulatedY}
          r="4.5"
          fill="#0c0f17"
          stroke="#dfb66d"
          strokeWidth="2.5"
        />

        {/* Baseline active dot */}
        <circle
          cx={activeX}
          cy={activeBaselineY}
          r="3.5"
          fill="#0c0f17"
          stroke="#94a3b8"
          strokeWidth="2"
        />

        {/* Invisible mouse hover listener columns across each month */}
        {data.map((_, i) => {
          const usableWidth = width - padding.left - padding.right;
          const colWidth = usableWidth / data.length;
          const colX = getX(i) - colWidth / 2;
          return (
            <rect
              key={i}
              x={colX}
              y={padding.top}
              width={colWidth}
              height={height - padding.top - padding.bottom}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
            />
          );
        })}
      </svg>
    </div>
  );
};
