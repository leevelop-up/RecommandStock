import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MarketIndexDetailProps {
  index: {
    name: string;
    value: number;
    change: number;
    changePercent: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const generateIndexChartData = (currentValue: number) => {
  const data = [];
  let value = currentValue * 0.92;
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '15:30'];
  
  for (let i = 0; i < times.length; i++) {
    value += (Math.random() - 0.45) * (currentValue * 0.02);
    data.push({
      time: times[i],
      value: parseFloat(value.toFixed(2)),
    });
  }
  
  data[data.length - 1].value = currentValue;
  
  return data;
};

export function MarketIndexDetail({ index, isOpen, onClose }: MarketIndexDetailProps) {
  if (!index) return null;

  const isPositive = index.change >= 0;
  const chartData = generateIndexChartData(index.value);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{index.name} 지수</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-semibold">{index.value.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className={`flex items-center gap-1 text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="size-5" /> : <TrendingDown className="size-5" />}
              {isPositive ? '+' : ''}{index.change.toFixed(2)}
            </span>
            <span className={`text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
            </span>
          </div>

          <div>
            <h4 className="font-medium mb-3">오늘의 추이</h4>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), '지수']}
                    labelFormatter={(label) => `시간: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={isPositive ? "#16a34a" : "#dc2626"}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">시가</p>
              <p className="text-lg font-medium">{(index.value - index.change * 0.3).toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">고가</p>
              <p className="text-lg font-medium text-red-600">{(index.value + Math.abs(index.change) * 0.5).toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">저가</p>
              <p className="text-lg font-medium text-blue-600">{(index.value - Math.abs(index.change) * 0.8).toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">거래량</p>
              <p className="text-lg font-medium">{(Math.random() * 500 + 300).toFixed(0)}백만</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">시장 분석</h4>
            <p className="text-sm text-gray-700">
              {index.name}은(는) 오늘 {isPositive ? '상승세를' : '하락세를'} 보이며 
              {isPositive ? ' 긍정적인' : ' 조정받는'} 흐름을 나타내고 있습니다. 
              {isPositive 
                ? '투자자들의 매수세가 유입되며 시장 심리가 개선되고 있습니다.' 
                : '단기 차익실현 매물이 출회되며 조정을 받고 있습니다.'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
