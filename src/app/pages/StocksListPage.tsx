import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Stock, StockCard } from "@/app/components/StockCard";
import { StockDetails } from "@/app/components/StockDetails";
import { NewsCard, News } from "@/app/components/NewsCard";
import { recommendedStocks, themeStocks, generateChartData } from "@/app/pages/HomePage";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Loader2, TrendingUp, Flame } from "lucide-react";

// 더 많은 종목 생성
const generateMoreStocks = (category: "recommended" | "theme", startId: number, count: number): Stock[] => {
  const stocks: Stock[] = [];
  
  const recommendedCompanies = [
    { symbol: "LG화학", name: "LG Chem", sector: "화학" },
    { symbol: "현대모비스", name: "Hyundai Mobis", sector: "자동차부품" },
    { symbol: "기아", name: "Kia Corporation", sector: "자동차" },
    { symbol: "한국전력", name: "KEPCO", sector: "전력" },
    { symbol: "삼성SDI", name: "Samsung SDI", sector: "2차전지" },
    { symbol: "KB금융", name: "KB Financial", sector: "금융" },
    { symbol: "신한지주", name: "Shinhan Financial", sector: "금융" },
    { symbol: "POSCO", name: "POSCO", sector: "철강" },
    { symbol: "HMM", name: "HMM", sector: "해운" },
    { symbol: "카카오뱅크", name: "Kakao Bank", sector: "핀테크" },
  ];

  const themeCompanies = [
    { symbol: "에코프로", name: "EcoPro", sector: "2차전지" },
    { symbol: "천보", name: "CheonBo", sector: "2차전지" },
    { symbol: "코스모신소재", name: "COSMO Advanced Materials", sector: "2차전지" },
    { symbol: "엘앤에프", name: "L&F", sector: "2차전지" },
    { symbol: "삼성전기", name: "Samsung Electro-Mechanics", sector: "전자부품" },
    { symbol: "메리츠금융", name: "Meritz Financial", sector: "금융" },
    { symbol: "SK이노베이션", name: "SK Innovation", sector: "에너지" },
    { symbol: "LG디스플레이", name: "LG Display", sector: "디스플레이" },
    { symbol: "하나금융지주", name: "Hana Financial", sector: "금융" },
    { symbol: "두산에너빌리티", name: "Doosan Enerbility", sector: "에너지" },
  ];

  const companies = category === "recommended" ? recommendedCompanies : themeCompanies;
  const recommendations: ("Strong Buy" | "Buy" | "Hold")[] = ["Strong Buy", "Buy", "Hold"];
  
  for (let i = 0; i < count; i++) {
    const company = companies[i % companies.length];
    const basePrice = Math.random() * 400000 + 50000;
    const change = (Math.random() - 0.5) * 10000;
    const changePercent = (change / basePrice) * 100;
    
    stocks.push({
      id: `${startId + i}`,
      symbol: `${company.symbol}`,
      name: company.name,
      price: Math.round(basePrice / 100) * 100,
      change: Math.round(change),
      changePercent: parseFloat(changePercent.toFixed(2)),
      marketCap: `${Math.round(Math.random() * 100 + 5)}조원`,
      peRatio: parseFloat((Math.random() * 40 + 10).toFixed(1)),
      dividendYield: parseFloat((Math.random() * 4).toFixed(2)),
      sector: company.sector,
      recommendation: recommendations[Math.floor(Math.random() * recommendations.length)],
      analystRating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
    });
  }
  
  return stocks;
};

// 뉴스 데이터 생성
const generateNews = (category: "recommended" | "theme"): News[] => {
  const recommendedNews = [
    {
      id: "news-1",
      title: "삼성전자, 신규 반도체 공장 투자 확대 발표",
      summary: "삼성전자가 차세대 반도체 생산을 위해 대규모 투자를 결정하며 글로벌 시장 점유율 확대를 노린다.",
      timestamp: "2시간 전",
      source: "한국경제",
    },
    {
      id: "news-2",
      title: "SK하이닉스, HBM 수요 급증으로 실적 개선 전망",
      summary: "AI 반도체 수요가 증가하면서 HBM 시장에서 SK하이닉스의 입지가 더욱 강화되고 있다.",
      timestamp: "4시간 전",
      source: "매일경제",
    },
    {
      id: "news-3",
      title: "네이버, AI 검색 기능 대폭 강화",
      summary: "네이버가 생성형 AI를 활용한 새로운 검색 서비스를 출시하며 사용자 경험을 혁신한다.",
      timestamp: "6시간 전",
      source: "서울경제",
    },
  ];

  const themeNews = [
    {
      id: "news-4",
      title: "2차전지 업계, 글로벌 수주 잇따라 발표",
      summary: "에코프로비엠을 비롯한 국내 2차전지 기업들이 유럽과 북미 시장에서 대규모 수주를 확보했다.",
      timestamp: "1시간 전",
      source: "이데일리",
    },
    {
      id: "news-5",
      title: "바이오 업계, 신약 개발 성과로 주가 상승세",
      summary: "삼성바이오로직스와 셀트리온의 신약 개발 진척으로 투자자들의 관심이 집중되고 있다.",
      timestamp: "3시간 전",
      source: "뉴스1",
    },
    {
      id: "news-6",
      title: "전기차 시장 확대, 자동차 부품사 수혜 기대",
      summary: "글로벌 전기차 수요 증가에 따라 현대차와 기아의 실적 개선이 예상된다.",
      timestamp: "5시간 전",
      source: "연합뉴스",
    },
  ];

  return category === "recommended" ? recommendedNews : themeNews;
};

export function StocksListPage() {
  const { type } = useParams<{ type: "recommended" | "theme" }>();
  const navigate = useNavigate();
  const category = (type || "recommended") as "recommended" | "theme";

  const initialStocks = category === "recommended" ? recommendedStocks : themeStocks;
  const [stocks, setStocks] = useState<Stock[]>(initialStocks);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const news = generateNews(category);

  const loadMoreStocks = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    setTimeout(() => {
      const newStocks = generateMoreStocks(category, stocks.length + 100, 10);
      setStocks(prev => [...prev, ...newStocks]);
      setLoading(false);
      
      if (stocks.length + newStocks.length >= 50) {
        setHasMore(false);
      }
    }, 1000);
  }, [loading, hasMore, stocks.length, category]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreStocks();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadMoreStocks]);

  const handleViewDetails = (stock: Stock) => {
    setSelectedStock(stock);
    setIsDetailsOpen(true);
  };

  const chartData = selectedStock ? generateChartData(selectedStock.price) : [];

  const title = category === "recommended" ? "금주 추천상품" : "금주 뜨는 테마주";
  const Icon = category === "recommended" ? TrendingUp : Flame;
  const iconBg = category === "recommended" ? "bg-blue-600" : "bg-orange-600";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="size-4 mr-2" />
            돌아가기
          </Button>
          <div className="flex items-center gap-3">
            <div className={`${iconBg} p-2 rounded-lg`}>
              <Icon className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold">{title}</h1>
              <p className="text-gray-600">
                {category === "recommended" 
                  ? "전문가들이 추천하는 종목 전체 목록" 
                  : "시장에서 주목받고 있는 테마 종목 전체 목록"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 종목 목록 */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">종목 목록</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stocks.map((stock) => (
                <StockCard
                  key={stock.id}
                  stock={stock}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* 무한 스크롤 트리거 */}
            <div ref={observerTarget} className="flex justify-center py-8">
              {loading && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="size-5 animate-spin" />
                  <span>로딩 중...</span>
                </div>
              )}
              {!hasMore && stocks.length > 0 && (
                <p className="text-gray-500 text-sm">모든 종목을 불러왔습니다.</p>
              )}
            </div>
          </div>

          {/* 관련 뉴스 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">관련 뉴스</h2>
            <div className="space-y-4 sticky top-8">
              {news.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          </div>
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
