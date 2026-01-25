import { Card } from "@/app/components/ui/card";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

const marketIndices: MarketIndex[] = [
  { name: "코스피", value: 2534.18, change: 14.32, changePercent: 0.57 },
  { name: "코스닥", value: 783.69, change: 5.08, changePercent: 0.65 },
  { name: "코스피200", value: 339.46, change: 2.54, changePercent: 0.75 },
  { name: "KRX300", value: 1873.52, change: -3.12, changePercent: -0.17 },
];

interface MarketOverviewProps {
  onIndexClick: (index: MarketIndex) => void;
}

export function MarketOverview({ onIndexClick }: MarketOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {marketIndices.map((index) => {
        const isPositive = index.change >= 0;
        return (
          <Card 
            key={index.name} 
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onIndexClick(index)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600">{index.name}</h4>
              <ArrowRight className="size-4 text-gray-400" />
            </div>
            <div className="mb-2">
              <p className="text-2xl font-semibold">{index.value.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
              <span>{isPositive ? '+' : ''}{index.change.toFixed(2)}</span>
              <span>({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}