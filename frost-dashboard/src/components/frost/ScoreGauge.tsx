// components/frost/ScoreGauge.tsx
import { useMemo } from 'react';

interface ScoreGaugeProps {
  score: number; // 0-100
  size?: number;
  showLabel?: boolean;
}

export function ScoreGauge({ score, size = 200, showLabel = true }: ScoreGaugeProps) {
  const normalizedScore = Math.max(0, Math.min(100, score));
  
  // Calculate color based on score
  const color = useMemo(() => {
    if (normalizedScore >= 80) return 'rgb(34, 197, 94)'; // green
    if (normalizedScore >= 60) return 'rgb(96, 165, 250)'; // blue
    if (normalizedScore >= 40) return 'rgb(251, 191, 36)'; // yellow
    return 'rgb(239, 68, 68)'; // red
  }, [normalizedScore]);
  
  // SVG arc path calculation
  const radius = 80;
  const strokeWidth = 12;
  const center = 100;
  const startAngle = -135; // degrees
  const endAngle = 135; // degrees
  const totalAngle = endAngle - startAngle;
  const scoreAngle = (normalizedScore / 100) * totalAngle;
  
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  
  const getPoint = (angle: number) => {
    const rad = toRadians(startAngle + angle);
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };
  
  const startPoint = getPoint(0);
  const endPoint = getPoint(scoreAngle);
  
  const largeArcFlag = scoreAngle > 180 ? 1 : 0;
  
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 200 200"
        className="transform -rotate-90"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Background arc */}
        <path
          d={`M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 1 1 ${getPoint(totalAngle).x} ${getPoint(totalAngle).y}`}
          fill="none"
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Score arc */}
        <path
          d={`M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      
      {/* Center score display */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">
            {Math.round(normalizedScore)}
          </span>
          <span className="text-xs text-slate-400 uppercase tracking-wide mt-1">
            Authenticity
          </span>
        </div>
      )}
    </div>
  );
}
