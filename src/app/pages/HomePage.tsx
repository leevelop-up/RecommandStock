import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StockCard, Stock } from "@/app/components/StockCard";
import { StockDetails } from "@/app/components/StockDetails";
import { MarketOverview } from "@/app/components/MarketOverview";
import { MarketIndexDetail } from "@/app/components/MarketIndexDetail";
import { HotThemeSection, Theme as HotTheme } from "@/app/components/HotThemeSection";
import { MissedOpportunitySection } from "@/app/components/MissedOpportunitySection";
import { ThemeTrendSection, ThemeTrend } from "@/app/components/ThemeTrendSection";
import { TrendingUp, Flame, ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { recommendationsApi, themesApi } from "@/app/services/api";
import { mockRecommendedStocks, mockThemeStocks, generateChartData } from "@/app/data/mockStocks";

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

  // API 데이터 상태
  const [recommendedStocks, setRecommendedStocks] = useState<Stock[]>(mockRecommendedStocks);
  const [themeStocks, setThemeStocks] = useState<Stock[]>(mockThemeStocks);
  const [risingThemes, setRisingThemes] = useState<ThemeTrend[]>([]);
  const [fallingThemes, setFallingThemes] = useState<ThemeTrend[]>([]);
  const [hotThemes, setHotThemes] = useState<HotTheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      console.log("🔄 HomePage 데이터 로딩 시작...");
      setLoading(true);
      setError(null);
      try {
        // 추천 종목, 급등 종목, 테마 데이터를 병렬로 가져오기
        const [todayData, growthData, themesData] = await Promise.all([
          recommendationsApi.getToday(),
          recommendationsApi.getGrowth(),
          themesApi.getAll(),
        ]);

        console.log("✅ 추천 종목 데이터:", todayData);
        console.log("✅ 급등 종목 데이터:", growthData);
        console.log("✅ 테마 데이터:", themesData);

        // API 응답을 Stock 형식으로 변환 (백엔드는 recommendedStocks / growthStocks 필드명 사용)
        const recStocks = todayData.recommendedStocks ?? todayData.recommendations ?? [];
        if (recStocks.length > 0) {
          const stocks: Stock[] = recStocks.slice(0, 4).map((rec: any) => ({
            id: rec.id || rec.stock_code || "",
            symbol: rec.symbol || rec.stock_code || "",
            name: rec.name || rec.stock_name || "",
            price: rec.price || 0,
            change: rec.change || 0,
            changePercent: rec.changePercent || 0,
            marketCap: rec.marketCap || "-",
            peRatio: rec.peRatio || 0,
            dividendYield: rec.dividendYield || 0,
            sector: rec.sector || rec.theme_name || "",
            recommendation: (rec.recommendation as Stock["recommendation"]) || "Hold",
            analystRating: rec.analystRating || 3,
          }));
          console.log("✅ 변환된 추천 종목:", stocks);
          setRecommendedStocks(stocks);
        } else {
          console.log("⚠️  추천 종목 데이터 없음, 목 데이터 사용");
        }

        const growthList = growthData.growthStocks ?? growthData.predictions ?? [];
        if (growthList.length > 0) {
          const stocks: Stock[] = growthList.slice(0, 6).map((pred: any) => ({
            id: pred.id || pred.stock_code || "",
            symbol: pred.symbol || pred.stock_code || "",
            name: pred.name || pred.stock_name || "",
            price: pred.price || 0,
            change: pred.change || 0,
            changePercent: pred.changePercent || pred.daily_change || 0,
            marketCap: pred.marketCap || "-",
            peRatio: pred.peRatio || 0,
            dividendYield: pred.dividendYield || 0,
            sector: pred.sector || pred.theme_name || "",
            recommendation: (pred.recommendation as Stock["recommendation"]) || "Hold",
            analystRating: pred.analystRating || 3,
          }));
          console.log("✅ 변환된 급등 종목:", stocks);
          setThemeStocks(stocks);
        } else {
          console.log("⚠️  급등 종목 데이터 없음, 목 데이터 사용");
        }

        // 테마 트렌드 데이터 변환
        if (themesData.themes && themesData.themes.length > 0) {
          const allThemes: ThemeTrend[] = themesData.themes.map((theme: any) => ({
            id: String(theme.id),
            name: theme.theme_name,
            currentScore: theme.theme_score || 0,
            scoreChange: theme.daily_change || 0,
            trend: theme.daily_change > 0 ? "up" as const : theme.daily_change < 0 ? "down" as const : "stable" as const,
          }));

          // 급상승 테마 (daily_change > 0, 상위 4개)
          const rising = allThemes
            .filter(t => t.scoreChange > 0)
            .sort((a, b) => b.scoreChange - a.scoreChange)
            .slice(0, 4);

          // 하락 테마 (daily_change < 0, 하위 3개)
          let falling = allThemes
            .filter(t => t.scoreChange < 0)
            .sort((a, b) => a.scoreChange - b.scoreChange)
            .slice(0, 3);

          // 하락 테마가 없으면 상승률이 낮은 테마를 표시 (상대적 하락)
          if (falling.length === 0) {
            falling = allThemes
              .filter(t => t.scoreChange >= 0)
              .sort((a, b) => a.scoreChange - b.scoreChange) // 낮은 상승률 순
              .slice(0, 3)
              .map(theme => ({
                ...theme,
                trend: "down" as const, // 상대적으로 낮은 상승
              }));
            console.log("⚠️  실제 하락 테마 없음, 상승률 낮은 테마로 대체");
          }

          console.log("✅ 급상승 테마:", rising);
          console.log("✅ 하락/저조 테마:", falling);

          setRisingThemes(rising);
          setFallingThemes(falling);

          // HOT 테마 TOP 3 (theme_score 기준 상위 3개)
          const hotTop3: HotTheme[] = themesData.themes
            .sort((a: any, b: any) => b.theme_score - a.theme_score)
            .slice(0, 3)
            .map((theme: any, index: number) => ({
              id: String(theme.id),
              rank: index + 1,
              name: theme.theme_name,
              score: Math.round(theme.theme_score || 0),
              newsCount: theme.news_count || 0,
              relatedStockCount: theme.stock_count || 0,
              avgReturn: theme.avg_return_rate || 0,
              summary: `테마 점수 ${Math.round(theme.theme_score)}점, ${theme.stock_count}개 관련주`,
              trend: theme.daily_change > 0 ? "up" as const : theme.daily_change < 0 ? "down" as const : "stable" as const,
            }));

          console.log("✅ HOT 테마 TOP 3:", hotTop3);
          setHotThemes(hotTop3);
        } else {
          console.log("⚠️  테마 데이터 없음");
        }
      } catch (err) {
        console.error("❌ API 로드 실패:", err);
        setError("데이터를 불러오는데 실패했습니다. Mock 데이터를 사용합니다.");
        // Mock 데이터 사용
        setRecommendedStocks(mockRecommendedStocks);
        setThemeStocks(mockThemeStocks);
      } finally {
        setLoading(false);
        console.log("✅ HomePage 로딩 완료");
      }
    };

    loadData();
  }, []);

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
        {hotThemes.length > 0 ? (
          <HotThemeSection themes={hotThemes} />
        ) : (
          <HotThemeSection />
        )}

        {/* 😢 놓친 기회 알림 */}
        <MissedOpportunitySection />

        {/* 📈 테마 트렌드 */}
        <ThemeTrendSection
          risingThemes={risingThemes}
          fallingThemes={fallingThemes}
        />

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
