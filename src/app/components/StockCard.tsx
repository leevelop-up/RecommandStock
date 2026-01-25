import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  peRatio: number;
  dividendYield: number;
  sector: string;
  recommendation: "Strong Buy" | "Buy" | "Hold";
  analystRating: number;
}

interface StockCardProps {
  stock: Stock;
  onViewDetails: (stock: Stock) => void;
}

export function StockCard({ stock, onViewDetails }: StockCardProps) {
  const isPositive = stock.change >= 0;

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "Strong Buy":
        return "bg-green-600 text-white hover:bg-green-700";
      case "Buy":
        return "bg-blue-600 text-white hover:bg-blue-700";
      default:
        return "bg-gray-600 text-white hover:bg-gray-700";
    }
  };

  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case "Strong Buy":
        return "적극매수";
      case "Buy":
        return "매수";
      default:
        return "보유";
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-xl">{stock.symbol}</h3>
            <Badge className={getRecommendationColor(stock.recommendation)}>
              {getRecommendationText(stock.recommendation)}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">{stock.name}</p>
          <p className="text-xs text-gray-500">{stock.sector}</p>
        </div>
        <button className="text-gray-400 hover:text-yellow-500 transition-colors">
          <Star className="size-5" />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-semibold">₩{stock.price.toLocaleString()}</span>
          <span className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </span>
        </div>
        <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}₩{stock.change.toLocaleString()} 오늘
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-y">
        <div>
          <p className="text-xs text-gray-500 mb-1">시가총액</p>
          <p className="text-sm font-medium">{stock.marketCap}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">PER</p>
          <p className="text-sm font-medium">{stock.peRatio.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">배당률</p>
          <p className="text-sm font-medium">{stock.dividendYield.toFixed(2)}%</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`size-4 ${
                  i < Math.floor(stock.analystRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            {stock.analystRating.toFixed(1)} 애널리스트 평가
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={() => onViewDetails(stock)}>
          상세보기
        </Button>
      </div>
    </Card>
  );
}