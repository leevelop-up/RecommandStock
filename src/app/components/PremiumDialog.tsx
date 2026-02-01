import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Check, Crown, Zap } from "lucide-react";

interface PremiumDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const premiumFeatures = [
  "실시간 시장 알림 무제한",
  "AI 기반 맞춤형 종목 추천",
  "상세 기업 분석 리포트 무제한 열람",
  "포트폴리오 자동 리밸런싱 제안",
  "전문가 투자 전략 독점 액세스",
  "프리미엄 웨비나 및 교육 컨텐츠",
  "우선 고객 지원",
  "광고 없는 경험",
];

const plans = [
  {
    name: "월간 구독",
    price: "19,900원",
    period: "/월",
    discount: null,
    popular: false,
  },
  {
    name: "연간 구독",
    price: "199,000원",
    period: "/년",
    discount: "17% 할인",
    popular: true,
  },
];

export function PremiumDialog({ isOpen, onClose }: PremiumDialogProps) {
  const handleSubscribe = (planName: string) => {
    alert(`${planName} 구독이 처리되었습니다!`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
              <Crown className="size-6 text-white" />
            </div>
            <DialogTitle className="text-2xl">프리미엄으로 업그레이드</DialogTitle>
          </div>
          <DialogDescription>
            더 많은 기능과 혜택을 누리고 현명한 투자 결정을 내리세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* 프리미엄 기능 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="size-5 text-yellow-500" />
              프리미엄 혜택
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 rounded-full p-1">
                    <Check className="size-4 text-green-600" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 요금제 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">요금제 선택</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`p-6 relative ${
                    plan.popular ? 'border-2 border-blue-500 shadow-lg' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      가장 인기
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-semibold mb-2">{plan.name}</h4>
                    {plan.discount && (
                      <span className="inline-block bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded mb-2">
                        {plan.discount}
                      </span>
                    )}
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-gray-500">{plan.period}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.name)}
                  >
                    {plan.popular ? '지금 시작하기' : '선택하기'}
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* 결제 안내 */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex gap-3">
              <div className="text-blue-600">ℹ️</div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">결제 안내</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>언제든지 구독을 취소할 수 있습니다</li>
                  <li>구독 취소 시 기간 종료까지 서비스를 이용할 수 있습니다</li>
                  <li>모든 주요 신용카드 및 간편결제를 지원합니다</li>
                  <li>VAT 포함 가격입니다</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
