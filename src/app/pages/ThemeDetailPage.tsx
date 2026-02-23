import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Newspaper,
  Star,
  Lock,
  Filter,
  Crown,
} from "lucide-react";
import { themesApi } from "@/app/services/api";

interface ThemeStock {
  id: number;
  stock_code: string;
  stock_name: string;
  stock_price: number;
  stock_change_rate: string;
  tier: number;
}

interface NewsItem {
  id: number;
  title: string;
  description?: string;
  link: string;
  source?: string;
  published?: string;
}

interface ThemeDetailData {
  id: number;
  theme_name: string;
  theme_score: number;
  change_rate: string;
  daily_change: number;
  stock_count: number;
  news_count: number;
  tier1_stocks: ThemeStock[];
  tier2_stocks: ThemeStock[];
  tier3_stocks: ThemeStock[];
  news: NewsItem[];
}

const tierLabel = (tier: number): "1차" | "2차" | "3차" => {
  if (tier === 1) return "1차";
  if (tier === 2) return "2차";
  return "3차";
};

const tierColors: Record<string, string> = {
  "1차": "bg-blue-600",
  "2차": "bg-green-600",
  "3차": "bg-orange-600",
};

const tierDescriptions: Record<string, string> = {
  "1차": "대형주 - 직접 관련",
  "2차": "중견주 - 부품/장비",
  "3차": "중소형주 - 소재/부품",
};

export function ThemeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await themesApi.getDetail(id);
        setTheme(data as unknown as ThemeDetailData);
      } catch (e) {
        setError("테마 데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">테마 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !theme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">{error || "테마를 찾을 수 없습니다."}</p>
          <Button className="mt-4" onClick={() => navigate("/themes")}>
            전체 테마로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const allStocks = [
    ...theme.tier1_stocks.map((s) => ({ ...s, tierLabel: "1차" as const, isPremium: false })),
    ...theme.tier2_stocks.map((s) => ({ ...s, tierLabel: "2차" as const, isPremium: false })),
    ...theme.tier3_stocks.map((s) => ({ ...s, tierLabel: "3차" as const, isPremium: false })),
  ];

  const filteredStocks = selectedTier
    ? allStocks.filter((s) => s.tierLabel === selectedTier)
    : allStocks;

  const tierCounts = {
    "1차": theme.tier1_stocks.length,
    "2차": theme.tier2_stocks.length,
    "3차": theme.tier3_stocks.length,
  };

  const isPositive = theme.daily_change >= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 뒤로가기 + 헤더 */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4 -ml-2"
            onClick={() => navigate("/themes")}
          >
            <ArrowLeft className="size-4 mr-2" />
            전체 테마로 돌아가기
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{theme.theme_name}</h1>
                <Badge className="bg-red-600 text-lg px-3 py-1">
                  {Math.round(theme.theme_score)}점
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">관련 뉴스</p>
                <p className="text-xl font-semibold flex items-center gap-1">
                  <Newspaper className="size-5" />
                  {theme.news.length}건
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">등락률</p>
                <p className={`text-xl font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {isPositive ? "+" : ""}{theme.change_rate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 티어 필터 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="size-5 text-gray-500" />
            <span className="font-medium">관련주 분류</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTier === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTier(null)}
            >
              전체 ({allStocks.length})
            </Button>
            {Object.entries(tierCounts).map(([tier, count]) => (
              <Button
                key={tier}
                variant={selectedTier === tier ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTier(tier)}
                className="flex items-center gap-2"
              >
                <span className={`w-2 h-2 rounded-full ${tierColors[tier]}`} />
                {tier} ({count})
              </Button>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {selectedTier && tierDescriptions[selectedTier]}
          </div>
        </div>

        {/* 관련주 테이블 */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">분류</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">종목명</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">현재가</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">등락률</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">관심</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredStocks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      관련 종목이 없습니다.
                    </td>
                  </tr>
                )}
                {filteredStocks.map((stock) => {
                  const changeRate = stock.stock_change_rate || "";
                  const positive = changeRate.startsWith("+") || (!changeRate.startsWith("-") && parseFloat(changeRate) >= 0);

                  return (
                    <tr
                      key={stock.id}
                      className="hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-4">
                        <Badge className={`${tierColors[stock.tierLabel]} text-xs`}>
                          {stock.tierLabel}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium">{stock.stock_name}</p>
                          <p className="text-xs text-gray-500">{stock.stock_code}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold">
                        {stock.stock_price > 0
                          ? `₩${stock.stock_price.toLocaleString()}`
                          : "-"}
                      </td>
                      <td className={`px-4 py-4 text-right font-semibold ${positive ? "text-green-600" : "text-red-600"}`}>
                        <div className="flex items-center justify-end gap-1">
                          {positive ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                          {changeRate || "-"}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                          <Star className="size-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 프리미엄 유도 */}
        <Card className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Crown className="size-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">숨은 관련주까지 모두 확인하세요</h3>
                <p className="text-sm text-gray-600">
                  프리미엄 회원은 3차/숨은 관련주와 실시간 알림을 받을 수 있어요
                </p>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              프리미엄 시작하기
            </Button>
          </div>
        </Card>

        {/* 관련 뉴스 */}
        {theme.news.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Newspaper className="size-5" />
              관련 뉴스
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {theme.news.slice(0, 4).map((article) => (
                <Card
                  key={article.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => article.link && window.open(article.link, "_blank")}
                >
                  <p className="text-sm text-gray-500 mb-1">
                    {article.source || "뉴스"}{article.published ? ` · ${new Date(article.published).toLocaleDateString("ko-KR")}` : ""}
                  </p>
                  <h3 className="font-medium mb-2 line-clamp-2">{article.title}</h3>
                  {article.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{article.description}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
