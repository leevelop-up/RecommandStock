import { useState } from "react";
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

interface RelatedStock {
  id: string;
  name: string;
  code: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  bidPrice: number;
  askPrice: number;
  volume: string;
  marketCap: string;
  tier: "1차" | "2차" | "3차" | "숨은";
  isPremium: boolean;
}

interface ThemeDetail {
  id: string;
  name: string;
  score: number;
  description: string;
  newsCount: number;
  avgReturn: number;
  relatedStocks: RelatedStock[];
}

const mockThemeDetails: Record<string, ThemeDetail> = {
  "ai-semiconductor": {
    id: "ai-semiconductor",
    name: "AI 반도체",
    score: 95,
    description:
      "인공지능 학습 및 추론에 필요한 고성능 반도체 관련 테마. 엔비디아 실적 호조와 HBM 수요 급증으로 관련주 상승세.",
    newsCount: 15,
    avgReturn: 3.2,
    relatedStocks: [
      {
        id: "1",
        name: "SK하이닉스",
        code: "000660",
        currentPrice: 142000,
        previousClose: 138500,
        change: 3500,
        changePercent: 2.53,
        bidPrice: 141900,
        askPrice: 142100,
        volume: "4,521,320",
        marketCap: "103조원",
        tier: "1차",
        isPremium: false,
      },
      {
        id: "2",
        name: "삼성전자",
        code: "005930",
        currentPrice: 71500,
        previousClose: 70300,
        change: 1200,
        changePercent: 1.71,
        bidPrice: 71400,
        askPrice: 71600,
        volume: "12,845,210",
        marketCap: "427조원",
        tier: "1차",
        isPremium: false,
      },
      {
        id: "3",
        name: "한미반도체",
        code: "042700",
        currentPrice: 89500,
        previousClose: 85200,
        change: 4300,
        changePercent: 5.05,
        bidPrice: 89400,
        askPrice: 89600,
        volume: "2,156,890",
        marketCap: "8.5조원",
        tier: "1차",
        isPremium: false,
      },
      {
        id: "4",
        name: "리노공업",
        code: "058470",
        currentPrice: 215000,
        previousClose: 210000,
        change: 5000,
        changePercent: 2.38,
        bidPrice: 214500,
        askPrice: 215500,
        volume: "312,450",
        marketCap: "3.2조원",
        tier: "2차",
        isPremium: false,
      },
      {
        id: "5",
        name: "ISC",
        code: "095340",
        currentPrice: 58200,
        previousClose: 56800,
        change: 1400,
        changePercent: 2.46,
        bidPrice: 58100,
        askPrice: 58300,
        volume: "856,320",
        marketCap: "1.1조원",
        tier: "2차",
        isPremium: false,
      },
      {
        id: "6",
        name: "테크윙",
        code: "089030",
        currentPrice: 32500,
        previousClose: 31200,
        change: 1300,
        changePercent: 4.17,
        bidPrice: 32400,
        askPrice: 32600,
        volume: "1,245,670",
        marketCap: "6,500억원",
        tier: "2차",
        isPremium: false,
      },
      {
        id: "7",
        name: "피에스케이홀딩스",
        code: "031980",
        currentPrice: 28750,
        previousClose: 27900,
        change: 850,
        changePercent: 3.05,
        bidPrice: 28700,
        askPrice: 28800,
        volume: "542,180",
        marketCap: "4,200억원",
        tier: "3차",
        isPremium: true,
      },
      {
        id: "8",
        name: "하나마이크론",
        code: "067310",
        currentPrice: 24800,
        previousClose: 23500,
        change: 1300,
        changePercent: 5.53,
        bidPrice: 24750,
        askPrice: 24850,
        volume: "2,856,420",
        marketCap: "3,100억원",
        tier: "3차",
        isPremium: true,
      },
      {
        id: "9",
        name: "네패스아크",
        code: "330860",
        currentPrice: 18500,
        previousClose: 17200,
        change: 1300,
        changePercent: 7.56,
        bidPrice: 18450,
        askPrice: 18550,
        volume: "1,523,890",
        marketCap: "1,800억원",
        tier: "숨은",
        isPremium: true,
      },
      {
        id: "10",
        name: "와이씨",
        code: "232140",
        currentPrice: 8520,
        previousClose: 7850,
        change: 670,
        changePercent: 8.54,
        bidPrice: 8500,
        askPrice: 8540,
        volume: "3,421,560",
        marketCap: "950억원",
        tier: "숨은",
        isPremium: true,
      },
    ],
  },
};

// 다른 테마들은 기본 데이터로
const defaultThemeDetail: ThemeDetail = {
  id: "default",
  name: "테마",
  score: 75,
  description: "테마 설명이 여기에 표시됩니다.",
  newsCount: 10,
  avgReturn: 2.5,
  relatedStocks: [],
};

const tierColors: Record<string, string> = {
  "1차": "bg-blue-600",
  "2차": "bg-green-600",
  "3차": "bg-orange-600",
  숨은: "bg-purple-600",
};

const tierDescriptions: Record<string, string> = {
  "1차": "대형주 - 직접 관련",
  "2차": "중견주 - 부품/장비",
  "3차": "중소형주 - 소재/부품",
  숨은: "초소형주 - 고수익 가능",
};

export function ThemeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const theme = id && mockThemeDetails[id] ? mockThemeDetails[id] : defaultThemeDetail;

  const filteredStocks = selectedTier
    ? theme.relatedStocks.filter((s) => s.tier === selectedTier)
    : theme.relatedStocks;

  const tierCounts = {
    "1차": theme.relatedStocks.filter((s) => s.tier === "1차").length,
    "2차": theme.relatedStocks.filter((s) => s.tier === "2차").length,
    "3차": theme.relatedStocks.filter((s) => s.tier === "3차").length,
    숨은: theme.relatedStocks.filter((s) => s.tier === "숨은").length,
  };

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
                <h1 className="text-3xl font-bold">{theme.name}</h1>
                <Badge className="bg-red-600 text-lg px-3 py-1">
                  {theme.score}점
                </Badge>
              </div>
              <p className="text-gray-600 max-w-2xl">{theme.description}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">관련 뉴스</p>
                <p className="text-xl font-semibold flex items-center gap-1">
                  <Newspaper className="size-5" />
                  {theme.newsCount}건
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">평균 수익률</p>
                <p className="text-xl font-semibold text-green-600">
                  +{theme.avgReturn}%
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
              전체 ({theme.relatedStocks.length})
            </Button>
            {Object.entries(tierCounts).map(([tier, count]) => (
              <Button
                key={tier}
                variant={selectedTier === tier ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTier(tier)}
                className="flex items-center gap-2"
              >
                <span
                  className={`w-2 h-2 rounded-full ${tierColors[tier]}`}
                />
                {tier} ({count})
                {tier === "숨은" && <Lock className="size-3 text-gray-400" />}
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    분류
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    종목명
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                    현재가
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                    전일비
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                    등락률
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                    매수호가
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                    매도호가
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                    거래량
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                    관심
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredStocks.map((stock) => {
                  const isPositive = stock.change >= 0;

                  if (stock.isPremium) {
                    return (
                      <tr
                        key={stock.id}
                        className="bg-gray-50/50 hover:bg-gray-100 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <Badge className={`${tierColors[stock.tier]} text-xs`}>
                            {stock.tier}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 font-medium text-gray-400">
                          <div className="flex items-center gap-2">
                            <Lock className="size-4" />
                            <span className="blur-sm select-none">
                              {stock.name}
                            </span>
                          </div>
                        </td>
                        <td
                          colSpan={6}
                          className="px-4 py-4 text-center text-gray-400"
                        >
                          <span className="blur-sm select-none">
                            ₩{stock.currentPrice.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Lock className="size-4 text-gray-400 mx-auto" />
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={stock.id}
                      className="hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-4">
                        <Badge className={`${tierColors[stock.tier]} text-xs`}>
                          {stock.tier}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium">{stock.name}</p>
                          <p className="text-xs text-gray-500">{stock.code}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold">
                        ₩{stock.currentPrice.toLocaleString()}
                      </td>
                      <td
                        className={`px-4 py-4 text-right ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        <div className="flex items-center justify-end gap-1">
                          {isPositive ? (
                            <TrendingUp className="size-4" />
                          ) : (
                            <TrendingDown className="size-4" />
                          )}
                          {isPositive ? "+" : ""}
                          {stock.change.toLocaleString()}
                        </div>
                      </td>
                      <td
                        className={`px-4 py-4 text-right font-semibold ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {stock.changePercent.toFixed(2)}%
                      </td>
                      <td className="px-4 py-4 text-right text-blue-600">
                        ₩{stock.bidPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right text-red-600">
                        ₩{stock.askPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right text-gray-600">
                        {stock.volume}
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
                <h3 className="font-semibold text-lg">
                  숨은 관련주까지 모두 확인하세요
                </h3>
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

        {/* 관련 뉴스 미리보기 */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Newspaper className="size-5" />
            관련 뉴스
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <p className="text-sm text-gray-500 mb-1">한국경제 · 2시간 전</p>
                <h3 className="font-medium mb-2 line-clamp-2">
                  {i === 1 && "엔비디아 실적 호조에 SK하이닉스 신고가 경신"}
                  {i === 2 && "삼성전자, HBM3E 양산 본격화...AI 반도체 수혜"}
                  {i === 3 && "한미반도체, AI 반도체 장비 수주 급증"}
                  {i === 4 && "글로벌 AI 투자 확대로 반도체 슈퍼사이클 전망"}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  AI 반도체 관련주들이 글로벌 AI 투자 확대 기대감에 강세를
                  보이고 있다...
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
