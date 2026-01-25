import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Stock } from "@/app/components/StockCard";
import { StockChart } from "@/app/components/StockChart";
import { Badge } from "@/app/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StockDetailsProps {
  stock: Stock | null;
  isOpen: boolean;
  onClose: () => void;
  chartData: Array<{ date: string; price: number }>;
}

export function StockDetails({ stock, isOpen, onClose, chartData }: StockDetailsProps) {
  if (!stock) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{stock.symbol}</span>
            <Badge className={getRecommendationColor(stock.recommendation)}>
              {getRecommendationText(stock.recommendation)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-1">{stock.name}</h3>
            <p className="text-sm text-gray-600">{stock.sector}</p>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-semibold">₩{stock.price.toLocaleString()}</span>
            <span className={`flex items-center gap-1 text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="size-5" /> : <TrendingDown className="size-5" />}
              {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </span>
            <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              ({isPositive ? '+' : ''}₩{stock.change.toLocaleString()})
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">시가총액</p>
              <p className="text-lg font-medium">{stock.marketCap}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">PER</p>
              <p className="text-lg font-medium">{stock.peRatio.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">배당률</p>
              <p className="text-lg font-medium">{stock.dividendYield.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">애널리스트 평가</p>
              <p className="text-lg font-medium">{stock.analystRating.toFixed(1)} / 5.0</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">6개월 주가 추이</h4>
            <StockChart data={chartData} stockSymbol={stock.symbol} />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">투자 포인트</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>{stock.sector} 섹터의 강력한 성장세와 안정적인 실적</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>PER {stock.peRatio.toFixed(2)}배로 {stock.peRatio < 20 ? '매력적인 밸류에이션' : '프리미엄 포지셔닝'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>{stock.dividendYield > 2 ? '배당 투자자에게 매력적인 배당수익률' : '성장 중심의 투자 기회'}</span>
              </li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs text-gray-500">
              주의사항: 본 정보는 시연용 예시 데이터이며 투자 조언이 아닙니다. 
              실제 투자 결정 전 반드시 금융 전문가와 상담하시기 바랍니다.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}