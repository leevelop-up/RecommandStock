import { useState } from "react";
import { StockCard, Stock } from "@/app/components/StockCard";
import { StockDetails } from "@/app/components/StockDetails";
import { Heart, TrendingUp } from "lucide-react";
import { Button } from "@/app/components/ui/button";

const watchlistStocks: Stock[] = [
  {
    id: "1",
    symbol: "삼성전자",
    name: "Samsung Electronics",
    price: 71500,
    change: 1200,
    changePercent: 1.71,
    marketCap: "427조원",
    peRatio: 15.2,
    dividendYield: 2.8,
    sector: "반도체",
    recommendation: "Strong Buy",
    analystRating: 4.7,
  },
  {
    id: "2",
    symbol: "SK하이닉스",
    name: "SK Hynix",
    price: 142000,
    change: 3500,
    changePercent: 2.53,
    marketCap: "103조원",
    peRatio: 18.5,
    dividendYield: 1.2,
    sector: "반도체",
    recommendation: "Strong Buy",
    analystRating: 4.8,
  },
  {
    id: "3",
    symbol: "NAVER",
    name: "Naver Corporation",
    price: 198500,
    change: 2500,
    changePercent: 1.28,
    marketCap: "32조원",
    peRatio: 22.3,
    dividendYield: 0.5,
    sector: "IT서비스",
    recommendation: "Strong Buy",
    analystRating: 4.5,
  },
];

const generateChartData = (currentPrice: number) => {
  const data = [];
  let price = currentPrice * 0.85;
  const months = ["7월", "8월", "9월", "10월", "11월", "12월", "1월"];

  for (let i = 0; i < months.length; i++) {
    price += (Math.random() - 0.4) * (currentPrice * 0.05);
    data.push({
      date: months[i],
      price: parseFloat(price.toFixed(2)),
    });
  }

  data[data.length - 1].price = currentPrice;

  return data;
};

export function WatchlistPage() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [stocks, setStocks] = useState<Stock[]>(watchlistStocks);

  const chartData = selectedStock ? generateChartData(selectedStock.price) : [];

  const handleViewDetails = (stock: Stock) => {
    setSelectedStock(stock);
    setIsDetailsOpen(true);
  };

  const handleRemoveFromWatchlist = (stockId: string) => {
    setStocks(stocks.filter((s) => s.id !== stockId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-pink-600 p-2 rounded-lg">
              <Heart className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">관심목록</h1>
              <p className="text-gray-600">
                관심있는 종목을 모아서 관리하세요
              </p>
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <div className="text-sm text-gray-600 mb-1">총 관심종목</div>
            <div className="text-2xl font-bold">{stocks.length}개</div>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <div className="text-sm text-gray-600 mb-1">평균 수익률</div>
            <div className="text-2xl font-bold text-green-600">+2.15%</div>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <div className="text-sm text-gray-600 mb-1">상승 종목</div>
            <div className="text-2xl font-bold">{stocks.filter(s => s.change > 0).length}개</div>
          </div>
        </div>

        {/* 종목 리스트 */}
        {stocks.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <Heart className="size-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              관심목록이 비어있습니다
            </h3>
            <p className="text-gray-500 mb-6">
              관심있는 종목을 추가해보세요
            </p>
            <Button onClick={() => window.history.back()}>
              종목 둘러보기
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.map((stock) => (
              <div key={stock.id} className="relative">
                <StockCard
                  stock={stock}
                  onViewDetails={handleViewDetails}
                />
                <button
                  onClick={() => handleRemoveFromWatchlist(stock.id)}
                  className="absolute top-4 right-4 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  title="관심목록에서 제거"
                >
                  <Heart className="size-4 text-red-500 fill-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Stock Details Modal */}
        <StockDetails
          stock={selectedStock}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          chartData={chartData}
        />
      </div>
    </div>
  );
}
