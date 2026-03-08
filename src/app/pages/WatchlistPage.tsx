import { useState, useEffect } from "react";
import { StockCard, Stock } from "@/app/components/StockCard";
import { StockDetails } from "@/app/components/StockDetails";
import { Heart } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { watchlistApi, WatchlistItem } from "@/app/services/api";

function toStock(item: WatchlistItem): Stock {
  return {
    id: item.ticker,
    symbol: item.stock_name ?? item.ticker,
    name: item.stock_name ?? item.ticker,
    price: 0,
    change: 0,
    changePercent: 0,
    marketCap: "N/A",
    peRatio: 0,
    dividendYield: 0,
    sector: "",
    recommendation: "Hold",
    analystRating: 0,
  };
}

export function WatchlistPage() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    watchlistApi.getAll()
      .then((items: WatchlistItem[]) => setStocks(items.map(toStock)))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleViewDetails = (stock: Stock) => {
    setSelectedStock(stock);
    setIsDetailsOpen(true);
  };

  const handleRemoveFromWatchlist = async (stockId: string) => {
    try {
      await watchlistApi.remove(stockId);
      setStocks(stocks.filter((s) => s.id !== stockId));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "삭제 실패");
    }
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
              <p className="text-gray-600">관심있는 종목을 모아서 관리하세요</p>
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
            <div className="text-sm text-gray-600 mb-1">상승 종목</div>
            <div className="text-2xl font-bold text-green-600">
              {stocks.filter((s) => s.change > 0).length}개
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <div className="text-sm text-gray-600 mb-1">하락 종목</div>
            <div className="text-2xl font-bold text-red-600">
              {stocks.filter((s) => s.change < 0).length}개
            </div>
          </div>
        </div>

        {/* 로딩/에러/목록 */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">불러오는 중...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : stocks.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <Heart className="size-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              관심목록이 비어있습니다
            </h3>
            <p className="text-gray-500 mb-6">관심있는 종목을 추가해보세요</p>
            <Button onClick={() => window.history.back()}>종목 둘러보기</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.map((stock) => (
              <div key={stock.id} className="relative">
                <StockCard stock={stock} onViewDetails={handleViewDetails} />
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
