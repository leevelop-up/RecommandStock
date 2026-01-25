import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StockChartProps {
  data: Array<{ date: string; price: number }>;
  stockSymbol: string;
}

export function StockChart({ data, stockSymbol }: StockChartProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [`₩${value.toLocaleString()}`, '가격']}
            labelFormatter={(label) => `날짜: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            name={stockSymbol}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}