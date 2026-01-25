import { Zap, Lock, Bell, Clock, TrendingUp, ChevronRight } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

export interface RealtimeAlert {
  id: string;
  type: "score_surge" | "new_theme" | "breaking_news" | "stock_alert";
  themeName: string;
  message: string;
  previousScore?: number;
  currentScore?: number;
  timestamp: string;
  isPremium: boolean;
}

interface RealtimeAlertPreviewProps {
  alerts?: RealtimeAlert[];
  onUpgradeClick?: () => void;
  onAlertClick?: (alert: RealtimeAlert) => void;
}

const defaultAlerts: RealtimeAlert[] = [
  {
    id: "1",
    type: "score_surge",
    themeName: "AI 반도체",
    message: "점수 급등!",
    previousScore: 85,
    currentScore: 95,
    timestamp: "10분 전",
    isPremium: false,
  },
  {
    id: "2",
    type: "breaking_news",
    themeName: "방산",
    message: "중동 긴장 고조 관련 속보",
    timestamp: "25분 전",
    isPremium: true,
  },
  {
    id: "3",
    type: "new_theme",
    themeName: "AI 에이전트",
    message: "새로운 테마 감지됨",
    currentScore: 72,
    timestamp: "1시간 전",
    isPremium: true,
  },
];

const getAlertTypeIcon = (type: RealtimeAlert["type"]) => {
  switch (type) {
    case "score_surge":
      return <TrendingUp className="size-4" />;
    case "new_theme":
      return <Zap className="size-4" />;
    case "breaking_news":
      return <Bell className="size-4" />;
    default:
      return <Bell className="size-4" />;
  }
};

const getAlertTypeBadge = (type: RealtimeAlert["type"]) => {
  switch (type) {
    case "score_surge":
      return <Badge className="bg-green-600">급등</Badge>;
    case "new_theme":
      return <Badge className="bg-purple-600">신규</Badge>;
    case "breaking_news":
      return <Badge className="bg-red-600">속보</Badge>;
    default:
      return <Badge className="bg-blue-600">알림</Badge>;
  }
};

export function RealtimeAlertPreview({
  alerts = defaultAlerts,
  onUpgradeClick,
  onAlertClick,
}: RealtimeAlertPreviewProps) {
  const latestAlert = alerts[0];

  return (
    <div className="mb-12">
      {/* 메인 알림 카드 */}
      <Card className="p-0 overflow-hidden border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50">
        <div className="bg-gradient-to-r from-yellow-400 to-amber-400 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="size-5 text-yellow-900" />
            <span className="font-semibold text-yellow-900">
              방금 전 급등 테마 발견!
            </span>
          </div>
          <Badge className="bg-yellow-900 text-yellow-100">LIVE</Badge>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {getAlertTypeBadge(latestAlert.type)}
                <span className="text-xl font-bold">'{latestAlert.themeName}'</span>
              </div>

              {latestAlert.previousScore && latestAlert.currentScore && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500">점수</span>
                  <span className="text-gray-400">{latestAlert.previousScore}</span>
                  <ChevronRight className="size-4 text-gray-400" />
                  <span className="text-2xl font-bold text-green-600">
                    {latestAlert.currentScore}
                  </span>
                  <span className="text-green-600 font-semibold">
                    (+{latestAlert.currentScore - latestAlert.previousScore})
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="size-4" />
                {latestAlert.timestamp} 업데이트
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => onAlertClick?.(latestAlert)}
            >
              자세히 보기
            </Button>
          </div>

          {/* 프리미엄 유도 */}
          <div className="mt-4 p-3 bg-white/60 rounded-lg border border-yellow-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="size-4 text-yellow-700" />
              <span className="text-sm text-yellow-800">
                <strong>프리미엄</strong> 회원은 30분 전 알림을 받았어요
              </span>
            </div>
            <Button
              size="sm"
              onClick={onUpgradeClick}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              지금 가입하기
            </Button>
          </div>
        </div>
      </Card>

      {/* 최근 알림 목록 */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
          <Bell className="size-4" />
          최근 알림
        </h3>
        <div className="space-y-2">
          {alerts.slice(1).map((alert) => (
            <Card
              key={alert.id}
              className={`p-3 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer ${
                alert.isPremium ? "opacity-60" : ""
              }`}
              onClick={() => !alert.isPremium && onAlertClick?.(alert)}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getAlertTypeIcon(alert.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{alert.themeName}</span>
                    {getAlertTypeBadge(alert.type)}
                    {alert.isPremium && (
                      <Lock className="size-3 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{alert.message}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{alert.timestamp}</span>
            </Card>
          ))}
        </div>
      </div>

      {/* 알림 설정 안내 */}
      <div className="mt-4 text-center">
        <Button variant="ghost" className="text-sm text-gray-500">
          <Bell className="size-4 mr-2" />
          알림 설정하기
        </Button>
      </div>
    </div>
  );
}
