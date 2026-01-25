import { TrendingUp, TrendingDown, Minus, BarChart3, ChevronRight } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { useNavigate } from "react-router-dom";

export interface ThemeTrend {
  id: string;
  name: string;
  currentScore: number;
  scoreChange: number;
  trend: "up" | "down" | "stable";
}

interface ThemeTrendSectionProps {
  risingThemes?: ThemeTrend[];
  fallingThemes?: ThemeTrend[];
  onThemeClick?: (theme: ThemeTrend) => void;
}

const defaultRisingThemes: ThemeTrend[] = [
  { id: "1", name: "AI 반도체", currentScore: 95, scoreChange: 35, trend: "up" },
  { id: "2", name: "방산", currentScore: 82, scoreChange: 28, trend: "up" },
  { id: "3", name: "로봇", currentScore: 78, scoreChange: 22, trend: "up" },
  { id: "4", name: "우주항공", currentScore: 71, scoreChange: 18, trend: "up" },
];

const defaultFallingThemes: ThemeTrend[] = [
  { id: "5", name: "부동산", currentScore: 42, scoreChange: -15, trend: "down" },
  { id: "6", name: "게임", currentScore: 38, scoreChange: -12, trend: "down" },
  { id: "7", name: "엔터", currentScore: 45, scoreChange: -8, trend: "down" },
];

const getTrendIcon = (trend: "up" | "down" | "stable") => {
  switch (trend) {
    case "up":
      return <TrendingUp className="size-4 text-green-500" />;
    case "down":
      return <TrendingDown className="size-4 text-red-500" />;
    default:
      return <Minus className="size-4 text-gray-500" />;
  }
};

const getTrendColor = (trend: "up" | "down" | "stable") => {
  switch (trend) {
    case "up":
      return "text-green-600";
    case "down":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getScoreBgColor = (score: number) => {
  if (score >= 80) return "bg-green-100 text-green-700";
  if (score >= 60) return "bg-yellow-100 text-yellow-700";
  if (score >= 40) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
};

export function ThemeTrendSection({
  risingThemes = defaultRisingThemes,
  fallingThemes = defaultFallingThemes,
  onThemeClick,
}: ThemeTrendSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <BarChart3 className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">이번 주 테마 트렌드</h2>
            <p className="text-sm text-gray-600">
              급상승/하락 중인 테마를 한눈에
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate("/themes/trend")}
        >
          그래프 보기
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 급상승 테마 */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🔥</span>
            <h3 className="font-semibold text-lg">급상승 중</h3>
          </div>
          <div className="space-y-3">
            {risingThemes.map((theme, index) => (
              <div
                key={theme.id}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                onClick={() => onThemeClick?.(theme)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-6">
                    {index + 1}
                  </span>
                  <span className="font-medium">{theme.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${getScoreBgColor(
                      theme.currentScore
                    )}`}
                  >
                    {theme.currentScore}점
                  </span>
                  <div className={`flex items-center gap-1 ${getTrendColor(theme.trend)}`}>
                    {getTrendIcon(theme.trend)}
                    <span className="text-sm font-semibold">
                      +{theme.scoreChange}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 하락 테마 */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📉</span>
            <h3 className="font-semibold text-lg">하락 중</h3>
          </div>
          <div className="space-y-3">
            {fallingThemes.map((theme, index) => (
              <div
                key={theme.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                onClick={() => onThemeClick?.(theme)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-6">
                    {index + 1}
                  </span>
                  <span className="font-medium">{theme.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${getScoreBgColor(
                      theme.currentScore
                    )}`}
                  >
                    {theme.currentScore}점
                  </span>
                  <div className={`flex items-center gap-1 ${getTrendColor(theme.trend)}`}>
                    {getTrendIcon(theme.trend)}
                    <span className="text-sm font-semibold">
                      {theme.scoreChange}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 빈 공간 채우기 - 하락 테마가 적을 경우 */}
          {fallingThemes.length < risingThemes.length && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
              하락 테마가 적은 것은 좋은 신호예요! 📈
            </div>
          )}
        </Card>
      </div>

      {/* 주간 요약 */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">상승 테마</p>
          <p className="text-2xl font-bold text-green-600">{risingThemes.length}개</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">하락 테마</p>
          <p className="text-2xl font-bold text-red-600">{fallingThemes.length}개</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">평균 점수 변화</p>
          <p className="text-2xl font-bold text-blue-600">+12.5</p>
        </Card>
      </div>
    </div>
  );
}
