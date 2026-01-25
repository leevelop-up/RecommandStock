import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StockCard, Stock } from "@/app/components/StockCard";
import { StockDetails } from "@/app/components/StockDetails";
import { MarketOverview } from "@/app/components/MarketOverview";
import { MarketIndexDetail } from "@/app/components/MarketIndexDetail";
import { HotThemeSection } from "@/app/components/HotThemeSection";
import { MissedOpportunitySection } from "@/app/components/MissedOpportunitySection";
import { ThemeTrendSection } from "@/app/components/ThemeTrendSection";
import { TrendingUp, Flame, ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";

const recommendedStocks: Stock[] = [
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
  {
    id: "4",
    symbol: "카카오",
    name: "Kakao Corp",
    price: 48900,
    change: 850,
    changePercent: 1.77,
    marketCap: "21조원",
    peRatio: 28.1,
    dividendYield: 0.3,
    sector: "IT서비스",
    recommendation: "Buy",
    analystRating: 4.2,
  },
];

const themeStocks: Stock[] = [
  {
    id: "5",
    symbol: "에코프로비엠",
    name: "EcoPro BM",
    price: 285000,
    change: 12000,
    changePercent: 4.4,
    marketCap: "18조원",
    peRatio: 35.2,
    dividendYield: 0.1,
    sector: "2차전지",
    recommendation: "Strong Buy",
    analystRating: 4.6,
  },
  {
    id: "6",
    symbol: "포스코홀딩스",
    name: "POSCO Holdings",
    price: 398000,
    change: 5500,
    changePercent: 1.4,
    marketCap: "34조원",
    peRatio: 12.8,
    dividendYield: 3.5,
    sector: "2차전지",
    recommendation: "Buy",
    analystRating: 4.3,
  },
  {
    id: "7",
    symbol: "LG에너지솔루션",
    name: "LG Energy Solution",
    price: 425000,
    change: 8000,
    changePercent: 1.92,
    marketCap: "99조원",
    peRatio: 42.1,
    dividendYield: 0.8,
    sector: "2차전지",
    recommendation: "Strong Buy",
    analystRating: 4.7,
  },
  {
    id: "8",
    symbol: "삼성바이오로직스",
    name: "Samsung Biologics",
    price: 892000,
    change: -5000,
    changePercent: -0.56,
    marketCap: "61조원",
    peRatio: 38.5,
    dividendYield: 0.2,
    sector: "바이오",
    recommendation: "Buy",
    analystRating: 4.4,
  },
  {
    id: "9",
    symbol: "셀트리온",
    name: "Celltrion",
    price: 178500,
    change: 3200,
    changePercent: 1.83,
    marketCap: "24조원",
    peRatio: 25.7,
    dividendYield: 1.1,
    sector: "바이오",
    recommendation: "Strong Buy",
    analystRating: 4.5,
  },
  {
    id: "10",
    symbol: "현대차",
    name: "Hyundai Motor",
    price: 215000,
    change: 4500,
    changePercent: 2.14,
    marketCap: "46조원",
    peRatio: 6.8,
    dividendYield: 4.2,
    sector: "자동차",
    recommendation: "Buy",
    analystRating: 4.1,
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

export function HomePage() {
  const navigate = useNavigate();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<{
    name: string;
    value: number;
    change: number;
    changePercent: number;
  } | null>(null);
  const [isIndexDetailOpen, setIsIndexDetailOpen] = useState(false);

  const chartData = selectedStock ? generateChartData(selectedStock.price) : [];

  const handleViewDetails = (stock: Stock) => {
    setSelectedStock(stock);
    setIsDetailsOpen(true);
  };

  const handleIndexClick = (index: {
    name: string;
    value: number;
    change: number;
    changePercent: number;
  }) => {
    setSelectedIndex(index);
    setIsIndexDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 시장 개요 */}
        <div className="mb-12">
          <h2 className="text-lg font-medium mb-4">시장 개요</h2>
          <MarketOverview onIndexClick={handleIndexClick} />
        </div>

        {/* 🔥 오늘의 HOT 테마 TOP 3 */}
        <HotThemeSection />

        {/* 😢 놓친 기회 알림 */}
        <MissedOpportunitySection />

        {/* 📈 테마 트렌드 */}
        <ThemeTrendSection />

        {/* 금주 추천상품 */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <TrendingUp className="size-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">금주 추천상품</h2>
                <p className="text-sm text-gray-600">
                  이번 주 전문가들이 추천하는 종목
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate("/stocks/recommended")}
            >
              더보기
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedStocks.map((stock) => (
              <StockCard
                key={stock.id}
                stock={stock}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>

        {/* 금주 뜨는 테마주 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-600 p-2 rounded-lg">
                <Flame className="size-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">금주 뜨는 테마주</h2>
                <p className="text-sm text-gray-600">
                  시장에서 주목받고 있는 테마 종목
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate("/stocks/theme")}
            >
              더보기
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themeStocks.map((stock) => (
              <StockCard
                key={stock.id}
                stock={stock}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>

        {/* Stock Details Modal */}
        <StockDetails
          stock={selectedStock}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          chartData={chartData}
        />

        {/* Market Index Detail Modal */}
        <MarketIndexDetail
          index={selectedIndex}
          isOpen={isIndexDetailOpen}
          onClose={() => setIsIndexDetailOpen(false)}
        />

        {/* 안내사항 */}
        <div className="mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>주의:</strong> 본 애플리케이션은 시연용 예시 데이터를
            사용합니다. 투자 조언이 아니며, 실제 투자 결정 전 반드시 금융
            전문가와 상담하시기 바랍니다. 과거 수익률이 미래 수익을 보장하지
            않습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export { recommendedStocks, themeStocks, generateChartData };
