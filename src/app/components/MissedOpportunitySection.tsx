import { TrendingUp, DollarSign, Calendar, Lock } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

export interface MissedOpportunity {
  themeName: string;
  yesterdayScore: number;
  todayReturn: number;
  investmentAmount: number;
  missedProfit: number;
  weeklyMissedProfit: number;
  topStock: {
    name: string;
    return: number;
  };
}

interface MissedOpportunitySectionProps {
  data?: MissedOpportunity;
  onUpgradeClick?: () => void;
}

const defaultData: MissedOpportunity = {
  themeName: "AI 반도체",
  yesterdayScore: 92,
  todayReturn: 8.7,
  investmentAmount: 1000000,
  missedProfit: 87000,
  weeklyMissedProfit: 325000,
  topStock: {
    name: "SK하이닉스",
    return: 12.3,
  },
};

export function MissedOpportunitySection({
  data = defaultData,
  onUpgradeClick,
}: MissedOpportunitySectionProps) {
  return (
    <div className="mb-12">
      <Card className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden relative">
        {/* 배경 이펙트 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">😢</span>
            <h2 className="text-xl font-semibold">어제 놓친 기회</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 왼쪽: 테마 정보 */}
            <div>
              <p className="text-gray-400 text-sm mb-2">어제 추천한 테마</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl font-bold text-yellow-400">
                  '{data.themeName}'
                </span>
                <span className="text-sm text-gray-400">
                  (점수 {data.yesterdayScore}/100)
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-300">오늘 평균</span>
                <span className="text-2xl font-bold text-green-400 flex items-center">
                  <TrendingUp className="size-5 mr-1" />+{data.todayReturn}%
                </span>
                <span className="text-gray-400">상승!</span>
              </div>

              {/* 최고 수익 종목 */}
              <div className="bg-white/10 rounded-lg p-3 inline-block">
                <p className="text-xs text-gray-400 mb-1">최고 수익 종목</p>
                <p className="font-semibold">
                  {data.topStock.name}{" "}
                  <span className="text-green-400">+{data.topStock.return}%</span>
                </p>
              </div>
            </div>

            {/* 오른쪽: 금액 정보 */}
            <div className="flex flex-col justify-center">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <p className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                  <DollarSign className="size-4" />
                  {(data.investmentAmount / 10000).toLocaleString()}만원 투자 시 놓친 수익
                </p>
                <p className="text-4xl font-bold text-red-400 mb-4">
                  💸 {data.missedProfit.toLocaleString()}원
                </p>

                <div className="border-t border-white/10 pt-3">
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <Calendar className="size-4" />
                    이번 주 누적 놓친 수익
                  </p>
                  <p className="text-xl font-semibold text-orange-400">
                    {data.weeklyMissedProfit.toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA 버튼 */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Lock className="size-4" />
              프리미엄 회원은 장 시작 30분 전 알림을 받아요
            </div>
            <Button
              onClick={onUpgradeClick}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold"
            >
              프리미엄으로 기회 잡기 →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
