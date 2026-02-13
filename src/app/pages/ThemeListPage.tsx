import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Filter,
  Flame,
  ChevronRight,
  Users,
} from "lucide-react";
import { themesApi } from "@/app/services/api";

export interface ThemeItem {
  id: string;
  name: string;
  score: number;
  previousScore: number;
  changePercent: number;
  relatedStockCount: number;
  trend: "up" | "down" | "stable";
  topStocks: string[];
  category: string;
}

const mockThemes: ThemeItem[] = [
  {
    id: "ai-semiconductor",
    name: "AI 반도체",
    score: 95,
    previousScore: 85,
    changePercent: 11.76,
    relatedStockCount: 47,
    trend: "up",
    topStocks: ["SK하이닉스", "삼성전자", "한미반도체"],
    category: "IT",
  },
  {
    id: "secondary-battery",
    name: "2차전지",
    score: 87,
    previousScore: 82,
    changePercent: 6.1,
    relatedStockCount: 38,
    trend: "up",
    topStocks: ["LG에너지솔루션", "에코프로비엠", "포스코퓨처엠"],
    category: "에너지",
  },
  {
    id: "defense",
    name: "방산",
    score: 82,
    previousScore: 75,
    changePercent: 9.33,
    relatedStockCount: 24,
    trend: "up",
    topStocks: ["한화에어로스페이스", "LIG넥스원", "한국항공우주"],
    category: "방위산업",
  },
  {
    id: "robot",
    name: "로봇",
    score: 78,
    previousScore: 60,
    changePercent: 30.0,
    relatedStockCount: 31,
    trend: "up",
    topStocks: ["두산로보틱스", "레인보우로보틱스", "로보스타"],
    category: "제조",
  },
  {
    id: "bio",
    name: "바이오",
    score: 75,
    previousScore: 78,
    changePercent: -3.85,
    relatedStockCount: 52,
    trend: "down",
    topStocks: ["삼성바이오로직스", "셀트리온", "SK바이오팜"],
    category: "헬스케어",
  },
  {
    id: "aerospace",
    name: "우주항공",
    score: 71,
    previousScore: 65,
    changePercent: 9.23,
    relatedStockCount: 18,
    trend: "up",
    topStocks: ["한국항공우주", "쎄트렉아이", "AP위성"],
    category: "방위산업",
  },
  {
    id: "ai-agent",
    name: "AI 에이전트",
    score: 72,
    previousScore: 0,
    changePercent: 100,
    relatedStockCount: 15,
    trend: "up",
    topStocks: ["카카오", "네이버", "솔트룩스"],
    category: "IT",
  },
  {
    id: "game",
    name: "게임",
    score: 45,
    previousScore: 52,
    changePercent: -13.46,
    relatedStockCount: 28,
    trend: "down",
    topStocks: ["크래프톤", "엔씨소프트", "넷마블"],
    category: "엔터",
  },
  {
    id: "entertainment",
    name: "엔터테인먼트",
    score: 48,
    previousScore: 55,
    changePercent: -12.73,
    relatedStockCount: 22,
    trend: "down",
    topStocks: ["하이브", "JYP엔터", "SM엔터"],
    category: "엔터",
  },
  {
    id: "real-estate",
    name: "부동산",
    score: 42,
    previousScore: 50,
    changePercent: -16.0,
    relatedStockCount: 35,
    trend: "down",
    topStocks: ["삼성물산", "현대건설", "DL이앤씨"],
    category: "건설",
  },
];

const getTrendIcon = (trend: "up" | "down" | "stable") => {
  switch (trend) {
    case "up":
      return <TrendingUp className="size-5" />;
    case "down":
      return <TrendingDown className="size-5" />;
    default:
      return <Minus className="size-5" />;
  }
};

const getTrendColor = (trend: "up" | "down" | "stable") => {
  switch (trend) {
    case "up":
      return "text-green-600 bg-green-50";
    case "down":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "bg-green-600";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
};

export function ThemeListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "change" | "stocks">("score");
  const [themes, setThemes] = useState<ThemeItem[]>([]);
  const [loading, setLoading] = useState(true);

  // API에서 테마 데이터 로드
  useEffect(() => {
    const loadThemes = async () => {
      try {
        const response = await themesApi.getAll();
        // API 데이터를 ThemeItem 형식으로 변환
        const apiThemes: ThemeItem[] = response.themes.map((theme: any) => ({
          id: String(theme.id),
          name: theme.theme_name,
          score: theme.theme_score || 0,
          previousScore: theme.theme_score || 0,
          changePercent: theme.daily_change || 0,
          relatedStockCount: theme.stock_count || 0,
          trend: theme.daily_change > 0 ? "up" : theme.daily_change < 0 ? "down" : "stable",
          topStocks: [],
          category: "테마",
        }));
        setThemes(apiThemes);
      } catch (error) {
        console.error("테마 로드 실패:", error);
        // 에러 시 목 데이터 사용
        setThemes(mockThemes);
      } finally {
        setLoading(false);
      }
    };

    loadThemes();
  }, []);

  const filteredThemes = themes
    .filter((theme) =>
      theme.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "change") return b.changePercent - a.changePercent;
      return b.relatedStockCount - a.relatedStockCount;
    });

  const handleThemeClick = (theme: ThemeItem) => {
    navigate(`/theme/${theme.id}`);
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">테마 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-600 p-2 rounded-lg">
              <Flame className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">전체 테마</h1>
              <p className="text-sm text-gray-600">
                AI가 분석한 {themes.length}개 테마의 실시간 점수
              </p>
            </div>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="테마명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="score">점수순</option>
              <option value="change">등락률순</option>
              <option value="stocks">관련주순</option>
            </select>
          </div>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">상승 테마</p>
            <p className="text-2xl font-bold text-green-600">
              {themes.filter((t) => t.trend === "up").length}개
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">하락 테마</p>
            <p className="text-2xl font-bold text-red-600">
              {themes.filter((t) => t.trend === "down").length}개
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">전체 관련주</p>
            <p className="text-2xl font-bold text-blue-600">
              {themes.reduce((acc, t) => acc + t.relatedStockCount, 0)}개
            </p>
          </Card>
        </div>

        {/* 테마 리스트 */}
        <div className="space-y-3">
          {filteredThemes.map((theme, index) => (
            <Card
              key={theme.id}
              className="p-4 hover:shadow-lg transition-all cursor-pointer hover:border-blue-300"
              onClick={() => handleThemeClick(theme)}
            >
              <div className="flex items-center justify-between">
                {/* 왼쪽: 순위 + 테마 정보 */}
                <div className="flex items-center gap-4">
                  {/* 순위 */}
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 font-bold text-gray-700">
                    {index + 1}
                  </div>

                  {/* 테마 정보 */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{theme.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {theme.category}
                      </Badge>
                      {theme.previousScore === 0 && (
                        <Badge className="bg-purple-600 text-xs">NEW</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="size-4" />
                        관련주 {theme.relatedStockCount}개
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className="truncate max-w-[200px]">
                        {theme.topStocks.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 점수 + 등락률 */}
                <div className="flex items-center gap-6">
                  {/* 점수 */}
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">테마 점수</p>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getScoreColor(theme.score)} rounded-full`}
                          style={{ width: `${theme.score}%` }}
                        />
                      </div>
                      <span className="font-bold text-lg">{theme.score}</span>
                    </div>
                  </div>

                  {/* 등락률 */}
                  <div
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg ${getTrendColor(
                      theme.trend
                    )}`}
                  >
                    {getTrendIcon(theme.trend)}
                    <span className="font-semibold">
                      {theme.changePercent > 0 ? "+" : ""}
                      {theme.changePercent.toFixed(1)}%
                    </span>
                  </div>

                  {/* 화살표 */}
                  <ChevronRight className="size-5 text-gray-400" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 검색 결과 없음 */}
        {filteredThemes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
