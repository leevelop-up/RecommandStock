import { Flame, Newspaper, TrendingUp, ChevronRight, Crown } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { useNavigate } from "react-router-dom";

export interface Theme {
  id: string;
  rank: number;
  name: string;
  score: number;
  newsCount: number;
  relatedStockCount: number;
  avgReturn: number;
  summary: string;
  trend: "up" | "down" | "stable";
}

interface HotThemeSectionProps {
  themes?: Theme[];
  onThemeClick?: (theme: Theme) => void;
}

const defaultThemes: Theme[] = [
  {
    id: "ai-semiconductor",
    rank: 1,
    name: "AI 반도체",
    score: 95,
    newsCount: 15,
    relatedStockCount: 47,
    avgReturn: 3.2,
    summary: "엔비디아 실적 호조, 삼성 HBM 양산 확대",
    trend: "up",
  },
  {
    id: "secondary-battery",
    rank: 2,
    name: "2차전지",
    score: 87,
    newsCount: 12,
    relatedStockCount: 38,
    avgReturn: 2.1,
    summary: "LG엔솔 북미 공장 증설, 전기차 판매 호조",
    trend: "up",
  },
  {
    id: "defense",
    rank: 3,
    name: "방산",
    score: 82,
    newsCount: 8,
    relatedStockCount: 24,
    avgReturn: 1.8,
    summary: "K-방산 수출 계약 체결, 중동 긴장 고조",
    trend: "stable",
  },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <span className="text-2xl">🥇</span>;
    case 2:
      return <span className="text-2xl">🥈</span>;
    case 3:
      return <span className="text-2xl">🥉</span>;
    default:
      return <span className="text-lg font-bold text-gray-500">{rank}</span>;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 90) return "bg-red-500";
  if (score >= 80) return "bg-orange-500";
  if (score >= 70) return "bg-yellow-500";
  return "bg-gray-500";
};

export function HotThemeSection({ themes = defaultThemes, onThemeClick }: HotThemeSectionProps) {
  const navigate = useNavigate();
  const topTheme = themes[0];
  const otherThemes = themes.slice(1, 3);

  const handleThemeClick = (theme: Theme) => {
    if (onThemeClick) {
      onThemeClick(theme);
    } else {
      navigate(`/theme/${theme.id}`);
    }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-lg">
            <Flame className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">오늘의 HOT 테마 TOP 3</h2>
            <p className="text-sm text-gray-600">
              AI가 분석한 오늘 가장 주목받는 테마
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate("/themes")}
        >
          전체 테마 보기
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* 1위 테마 - 강조 */}
      <Card
        className="p-6 mb-4 border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => handleThemeClick(topTheme)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {getRankIcon(topTheme.rank)}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold">{topTheme.name}</h3>
                <Badge className="bg-red-600 text-white">HOT</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <span className="flex items-center gap-1">
                  <Newspaper className="size-4" />
                  뉴스 {topTheme.newsCount}건
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="size-4" />
                  관련주 {topTheme.relatedStockCount}개
                </span>
              </div>
              <p className="text-sm text-gray-700">
                평균 수익률: <span className="text-green-600 font-semibold">+{topTheme.avgReturn}%</span>
              </p>
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                💬 {topTheme.summary}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <span className="text-sm text-gray-500">테마 점수</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getScoreColor(topTheme.score)} rounded-full`}
                    style={{ width: `${topTheme.score}%` }}
                  />
                </div>
                <span className="text-xl font-bold text-red-600">{topTheme.score}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              더보기 <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* 2위, 3위 테마 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {otherThemes.map((theme) => (
          <Card
            key={theme.id}
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleThemeClick(theme)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getRankIcon(theme.rank)}
                <div>
                  <h3 className="font-semibold">{theme.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>뉴스 {theme.newsCount}건</span>
                    <span>관련주 {theme.relatedStockCount}개</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{theme.score}</span>
                  <span className="text-xs text-gray-500">/100</span>
                </div>
                <span className="text-xs text-green-600">+{theme.avgReturn}%</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 프리미엄 유도 */}
      <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="size-5 text-purple-600" />
          <span className="text-sm text-purple-800">
            <strong>프리미엄</strong> 회원은 TOP 20 테마와 숨은 관련주까지 확인할 수 있어요
          </span>
        </div>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
          업그레이드
        </Button>
      </div>
    </div>
  );
}
