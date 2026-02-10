import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { StockCard, Stock } from "@/app/components/StockCard";
import { StockDetails } from "@/app/components/StockDetails";
import { PremiumDialog } from "@/app/components/PremiumDialog";
import { SettingsDialog } from "@/app/components/SettingsDialog";
import { generateChartData } from "@/app/data/mockStocks";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  User,
  Star,
  TrendingUp,
  Bell,
  Settings,
  Wallet,
  Crown,
} from "lucide-react";

// 사용자 정보
const userInfo = {
  name: "김투자",
  email: "investor@example.com",
  memberSince: "2023년 1월",
  totalInvestment: "50,000,000원",
  totalReturn: "+12.5%",
  portfolioValue: "56,250,000원",
};

// 관심 종목
const favoriteStocks: Stock[] = [
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
];

// 포트폴리오
interface Portfolio {
  stock: Stock;
  quantity: number;
  avgPrice: number;
  currentValue: number;
  profit: number;
  profitPercent: number;
}

const portfolioStocks: Portfolio[] = [
  {
    stock: {
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
    quantity: 100,
    avgPrice: 65000,
    currentValue: 7150000,
    profit: 650000,
    profitPercent: 10.0,
  },
  {
    stock: {
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
    quantity: 50,
    avgPrice: 130000,
    currentValue: 7100000,
    profit: 600000,
    profitPercent: 9.23,
  },
];

// 최근 본 종목
const recentStocks: Stock[] = [
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
];

export function MyPage() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPremiumDialogOpen, setIsPremiumDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  const handleViewDetails = (stock: Stock) => {
    setSelectedStock(stock);
    setIsDetailsOpen(true);
  };

  const chartData = selectedStock ? generateChartData(selectedStock.price) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 프로필 헤더 */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="size-20">
                  <AvatarFallback className="bg-blue-600 text-white text-2xl">
                    {userInfo.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-semibold">{userInfo.name}</h1>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setIsPremiumDialogOpen(true)}
                    >
                      <Crown className="size-3 mr-1" />
                      프리미엄 전환
                    </Button>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{userInfo.email}</p>
                  <p className="text-xs text-gray-500">
                    가입일: {userInfo.memberSince}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setIsSettingsDialogOpen(true)}
              >
                <Settings className="size-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Wallet className="size-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">총 투자금</p>
                  <p className="text-lg font-semibold">
                    {userInfo.totalInvestment}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="size-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">총 수익률</p>
                  <p className="text-lg font-semibold text-green-600">
                    {userInfo.totalReturn}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Star className="size-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">포트폴리오 가치</p>
                  <p className="text-lg font-semibold">
                    {userInfo.portfolioValue}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 탭 콘텐츠 */}
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="portfolio">포트폴리오</TabsTrigger>
            <TabsTrigger value="favorites">관심 종목</TabsTrigger>
            <TabsTrigger value="recent">최근 본 종목</TabsTrigger>
          </TabsList>

          {/* 포트폴리오 탭 */}
          <TabsContent value="portfolio" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">보유 종목</h2>
              <div className="space-y-4">
                {portfolioStocks.map((item) => (
                  <Card key={item.stock.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {item.stock.symbol}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.stock.name}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(item.stock)}
                      >
                        상세보기
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">보유 수량</p>
                        <p className="text-sm font-medium">{item.quantity}주</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          평균 매수가
                        </p>
                        <p className="text-sm font-medium">
                          ₩{item.avgPrice.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">현재가</p>
                        <p className="text-sm font-medium">
                          ₩{item.stock.price.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">평가 금액</p>
                        <p className="text-sm font-medium">
                          ₩{item.currentValue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">수익률</p>
                        <p
                          className={`text-sm font-medium ${
                            item.profit >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {item.profit >= 0 ? "+" : ""}₩
                          {item.profit.toLocaleString()} (
                          {item.profitPercent >= 0 ? "+" : ""}
                          {item.profitPercent}%)
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 관심 종목 탭 */}
          <TabsContent value="favorites" className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="size-5 text-yellow-500 fill-yellow-500" />
                <h2 className="text-xl font-semibold">관심 종목</h2>
                <span className="text-sm text-gray-500">
                  ({favoriteStocks.length}개)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteStocks.map((stock) => (
                  <StockCard
                    key={stock.id}
                    stock={stock}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 최근 본 종목 탭 */}
          <TabsContent value="recent" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">최근 본 종목</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentStocks.map((stock) => (
                  <StockCard
                    key={stock.id}
                    stock={stock}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* 알림 설정 */}
        <Card className="p-6 mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Bell className="size-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold">알림 설정</h3>
                <p className="text-sm text-gray-600">
                  관심 종목의 가격 변동을 알려드립니다
                </p>
              </div>
            </div>
            <Button variant="outline">설정하기</Button>
          </div>
        </Card>

        {/* Stock Details Modal */}
        <StockDetails
          stock={selectedStock}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          chartData={chartData}
        />

        {/* Premium Dialog */}
        <PremiumDialog
          isOpen={isPremiumDialogOpen}
          onClose={() => setIsPremiumDialogOpen(false)}
        />

        {/* Settings Dialog */}
        <SettingsDialog
          isOpen={isSettingsDialogOpen}
          onClose={() => setIsSettingsDialogOpen(false)}
        />
      </div>
    </div>
  );
}
