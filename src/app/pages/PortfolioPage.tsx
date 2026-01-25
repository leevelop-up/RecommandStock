import { useState } from "react";
import { StockCard, Stock } from "@/app/components/StockCard";
import { StockDetails } from "@/app/components/StockDetails";
import { Briefcase, TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

interface PortfolioStock extends Stock {
  quantity: number;
  avgPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

const portfolioStocks: PortfolioStock[] = [
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
    quantity: 50,
    avgPrice: 68000,
    totalValue: 3575000,
    profitLoss: 175000,
    profitLossPercent: 5.15,
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
    quantity: 20,
    avgPrice: 135000,
    totalValue: 2840000,
    profitLoss: 140000,
    profitLossPercent: 5.19,
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
    quantity: 10,
    avgPrice: 205000,
    totalValue: 1985000,
    profitLoss: -65000,
    profitLossPercent: -3.17,
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

export function PortfolioPage() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [stocks] = useState<PortfolioStock[]>(portfolioStocks);

  const totalInvestment = stocks.reduce((sum, stock) => sum + stock.avgPrice * stock.quantity, 0);
  const totalValue = stocks.reduce((sum, stock) => sum + stock.totalValue, 0);
  const totalProfitLoss = totalValue - totalInvestment;
  const totalProfitLossPercent = (totalProfitLoss / totalInvestment) * 100;

  const chartData = selectedStock ? generateChartData(selectedStock.price) : [];

  const handleViewDetails = (stock: Stock) => {
    setSelectedStock(stock);
    setIsDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Briefcase className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">포트폴리오</h1>
              <p className="text-gray-600">
                보유 중인 종목과 수익률을 확인하세요
              </p>
            </div>
          </div>
        </div>

        {/* 포트폴리오 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <DollarSign className="size-4" />
              총 투자금액
            </div>
            <div className="text-2xl font-bold">
              {totalInvestment.toLocaleString()}원
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <PieChart className="size-4" />
              평가금액
            </div>
            <div className="text-2xl font-bold">
              {totalValue.toLocaleString()}원
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              {totalProfitLoss >= 0 ? (
                <TrendingUp className="size-4 text-green-600" />
              ) : (
                <TrendingDown className="size-4 text-red-600" />
              )}
              평가손익
            </div>
            <div
              className={`text-2xl font-bold ${
                totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {totalProfitLoss >= 0 ? "+" : ""}
              {totalProfitLoss.toLocaleString()}원
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <TrendingUp className="size-4" />
              수익률
            </div>
            <div
              className={`text-2xl font-bold ${
                totalProfitLossPercent >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {totalProfitLossPercent >= 0 ? "+" : ""}
              {totalProfitLossPercent.toFixed(2)}%
            </div>
          </Card>
        </div>

        {/* 보유 종목 리스트 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">보유 종목</h2>
          {stocks.length === 0 ? (
            <Card className="p-12 text-center">
              <Briefcase className="size-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                보유 종목이 없습니다
              </h3>
              <p className="text-gray-500 mb-6">
                종목을 매수하여 포트폴리오를 구성해보세요
              </p>
              <Button onClick={() => window.history.back()}>
                종목 둘러보기
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {stocks.map((stock) => (
                <Card key={stock.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold">{stock.symbol}</h3>
                        <span className="text-sm text-gray-500">{stock.name}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">현재가</div>
                          <div className="font-semibold">
                            {stock.price.toLocaleString()}원
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">보유수량</div>
                          <div className="font-semibold">{stock.quantity}주</div>
                        </div>
                        <div>
                          <div className="text-gray-500">평균단가</div>
                          <div className="font-semibold">
                            {stock.avgPrice.toLocaleString()}원
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">평가금액</div>
                          <div className="font-semibold">
                            {stock.totalValue.toLocaleString()}원
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">평가손익</div>
                          <div
                            className={`font-semibold ${
                              stock.profitLoss >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {stock.profitLoss >= 0 ? "+" : ""}
                            {stock.profitLoss.toLocaleString()}원
                            <span className="text-xs ml-1">
                              ({stock.profitLossPercent >= 0 ? "+" : ""}
                              {stock.profitLossPercent.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(stock)}
                    >
                      상세보기
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

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
