import { useState, useEffect } from "react";
import { Stock } from "@/app/components/StockCard";
import { StockDetails } from "@/app/components/StockDetails";
import { Briefcase, TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { portfolioApi, PortfolioItem } from "@/app/services/api";

interface PortfolioStock extends Stock {
  quantity: number;
  avgPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

function toPortfolioStock(item: PortfolioItem): PortfolioStock {
  const totalValue = item.avg_price * item.quantity;
  return {
    id: item.ticker,
    symbol: item.stock_name ?? item.ticker,
    name: item.stock_name ?? item.ticker,
    price: item.avg_price,
    change: 0,
    changePercent: 0,
    marketCap: "N/A",
    peRatio: 0,
    dividendYield: 0,
    sector: "",
    recommendation: "Hold",
    analystRating: 0,
    quantity: item.quantity,
    avgPrice: item.avg_price,
    totalValue,
    profitLoss: 0,
    profitLossPercent: 0,
  };
}

export function PortfolioPage() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [stocks, setStocks] = useState<PortfolioStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    portfolioApi.getAll()
      .then((items: PortfolioItem[]) => setStocks(items.map(toPortfolioStock)))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const totalInvestment = stocks.reduce((sum, s) => sum + s.avgPrice * s.quantity, 0);
  const totalValue = stocks.reduce((sum, s) => sum + s.totalValue, 0);
  const totalProfitLoss = totalValue - totalInvestment;
  const totalProfitLossPercent = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Briefcase className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">포트폴리오</h1>
              <p className="text-gray-600">보유 중인 종목과 수익률을 확인하세요</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <DollarSign className="size-4" />총 투자금액
            </div>
            <div className="text-2xl font-bold">{totalInvestment.toLocaleString()}원</div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <PieChart className="size-4" />평가금액
            </div>
            <div className="text-2xl font-bold">{totalValue.toLocaleString()}원</div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              {totalProfitLoss >= 0 ? <TrendingUp className="size-4 text-green-600" /> : <TrendingDown className="size-4 text-red-600" />}
              평가손익
            </div>
            <div className={`text-2xl font-bold ${totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalProfitLoss >= 0 ? "+" : ""}{totalProfitLoss.toLocaleString()}원
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <TrendingUp className="size-4" />수익률
            </div>
            <div className={`text-2xl font-bold ${totalProfitLossPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalProfitLossPercent >= 0 ? "+" : ""}{totalProfitLossPercent.toFixed(2)}%
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">보유 종목</h2>
          {loading ? (
            <div className="text-center py-12 text-gray-500">불러오는 중...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : stocks.length === 0 ? (
            <Card className="p-12 text-center">
              <Briefcase className="size-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">보유 종목이 없습니다</h3>
              <p className="text-gray-500 mb-6">종목을 매수하여 포트폴리오를 구성해보세요</p>
              <Button onClick={() => window.history.back()}>종목 둘러보기</Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {stocks.map((stock) => (
                <Card key={stock.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold">{stock.symbol}</h3>
                        <span className="text-sm text-gray-500">{stock.id}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">보유수량</div>
                          <div className="font-semibold">{stock.quantity}주</div>
                        </div>
                        <div>
                          <div className="text-gray-500">평균단가</div>
                          <div className="font-semibold">{stock.avgPrice.toLocaleString()}원</div>
                        </div>
                        <div>
                          <div className="text-gray-500">평가금액</div>
                          <div className="font-semibold">{stock.totalValue.toLocaleString()}원</div>
                        </div>
                        <div>
                          <div className="text-gray-500">평가손익</div>
                          <div className={`font-semibold ${stock.profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {stock.profitLoss >= 0 ? "+" : ""}{stock.profitLoss.toLocaleString()}원
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setSelectedStock(stock); setIsDetailsOpen(true); }}
                    >
                      상세보기
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <StockDetails
          stock={selectedStock}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          chartData={[]}
        />
      </div>
    </div>
  );
}
