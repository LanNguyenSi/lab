// components/frost/ScoreTrendChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ScoreHistory } from '../../data/mockHistory';

interface ScoreTrendChartProps {
  data: ScoreHistory[];
  height?: number;
}

export function ScoreTrendChart({ data, height = 300 }: ScoreTrendChartProps) {
  // Transform data for chart
  const chartData = data.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    score: item.authenticityScore,
    flow: Math.round(item.conversationalFlow * 100),
    depth: Math.round(item.emotionalDepth * 100),
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
        <XAxis 
          dataKey="time" 
          stroke="#94a3b8"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#94a3b8"
          style={{ fontSize: '12px' }}
          domain={[0, 100]}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#f1f5f9' }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px' }}
          iconType="line"
        />
        <Line 
          type="monotone" 
          dataKey="score" 
          stroke="#60a5fa" 
          strokeWidth={2}
          dot={{ fill: '#60a5fa', r: 4 }}
          activeDot={{ r: 6 }}
          name="Authenticity Score"
        />
        <Line 
          type="monotone" 
          dataKey="flow" 
          stroke="#34d399" 
          strokeWidth={2}
          dot={{ fill: '#34d399', r: 3 }}
          name="Conversational Flow"
        />
        <Line 
          type="monotone" 
          dataKey="depth" 
          stroke="#a78bfa" 
          strokeWidth={2}
          dot={{ fill: '#a78bfa', r: 3 }}
          name="Emotional Depth"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
