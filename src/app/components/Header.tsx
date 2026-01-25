import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, TrendingUp, Zap, Clock, Lock, ChevronRight, User, Heart, Briefcase, LogOut } from "lucide-react";

const categories = [
  { name: "추천 종목", path: "/stocks/recommended" },
  { name: "테마 종목", path: "/stocks/theme" },
  { name: "시장 지표", path: "/market" },
];

interface Alert {
  id: string;
  type: "score_surge" | "new_theme" | "breaking_news";
  themeName: string;
  message: string;
  previousScore?: number;
  currentScore?: number;
  timestamp: string;
  isPremium: boolean;
  isRead: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "score_surge",
    themeName: "AI 반도체",
    message: "점수 85 → 95 급등!",
    previousScore: 85,
    currentScore: 95,
    timestamp: "10분 전",
    isPremium: false,
    isRead: false,
  },
  {
    id: "2",
    type: "breaking_news",
    themeName: "방산",
    message: "중동 긴장 고조 관련 속보",
    timestamp: "25분 전",
    isPremium: true,
    isRead: false,
  },
  {
    id: "3",
    type: "new_theme",
    themeName: "AI 에이전트",
    message: "새로운 테마 감지됨 (72점)",
    currentScore: 72,
    timestamp: "1시간 전",
    isPremium: true,
    isRead: true,
  },
  {
    id: "4",
    type: "score_surge",
    themeName: "로봇",
    message: "점수 60 → 78 상승",
    previousScore: 60,
    currentScore: 78,
    timestamp: "2시간 전",
    isPremium: false,
    isRead: true,
  },
];

const getAlertTypeIcon = (type: Alert["type"]) => {
  switch (type) {
    case "score_surge":
      return <TrendingUp className="size-4 text-green-500" />;
    case "new_theme":
      return <Zap className="size-4 text-purple-500" />;
    case "breaking_news":
      return <Bell className="size-4 text-red-500" />;
  }
};

const getAlertTypeBadge = (type: Alert["type"]) => {
  switch (type) {
    case "score_surge":
      return <Badge className="bg-green-600 text-[10px] px-1.5">급등</Badge>;
    case "new_theme":
      return <Badge className="bg-purple-600 text-[10px] px-1.5">신규</Badge>;
    case "breaking_news":
      return <Badge className="bg-red-600 text-[10px] px-1.5">속보</Badge>;
  }
};

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [alerts] = useState<Alert[]>(mockAlerts);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 로그인 상태 확인
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/");
  };

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link to="/" className="flex items-center d-2">
            <div className="text-xl font-bold text-blue-600 banner pr-3">
              RecommandStock
            </div>
          </Link>

          {/* 카테고리 네비게이션 */}
          <nav className="hidden md:flex items-center gap-8">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === category.path
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-gray-700"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* 알림 + 로그인/사용자 메뉴 */}
          <div className="flex items-center gap-3">
            {/* 알림 아이콘 */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Bell className="size-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0" align="end">
                {/* 헤더 */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Bell className="size-4" />
                    <span className="font-semibold">알림</span>
                    {unreadCount > 0 && (
                      <Badge variant="secondary">{unreadCount}개 새 알림</Badge>
                    )}
                  </div>
                  <button className="text-xs text-blue-600 hover:underline">
                    모두 읽음
                  </button>
                </div>

                {/* 알림 목록 */}
                <div className="max-h-80 overflow-y-auto">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-start gap-3 px-4 py-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                        !alert.isRead ? "bg-blue-50/50" : ""
                      } ${alert.isPremium ? "opacity-70" : ""}`}
                    >
                      <div className="p-2 bg-gray-100 rounded-lg mt-0.5">
                        {getAlertTypeIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm truncate">
                            {alert.themeName}
                          </span>
                          {getAlertTypeBadge(alert.type)}
                          {alert.isPremium && (
                            <Lock className="size-3 text-gray-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                          <Clock className="size-3" />
                          {alert.timestamp}
                        </div>
                      </div>
                      {!alert.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      )}
                    </div>
                  ))}
                </div>

                {/* 프리미엄 유도 */}
                <div className="px-4 py-3 bg-gradient-to-r from-yellow-50 to-amber-50 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="size-4 text-yellow-700" />
                      <span className="text-xs text-yellow-800">
                        프리미엄은 <strong>30분 전</strong> 알림
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700 text-xs h-7"
                    >
                      업그레이드
                    </Button>
                  </div>
                </div>

                {/* 푸터 */}
                <div className="px-4 py-2 border-t">
                  <button className="w-full text-center text-sm text-blue-600 hover:underline flex items-center justify-center gap-1">
                    전체 알림 보기
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            {/* 로그인 상태에 따른 버튼 */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <User className="size-5 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/watchlist")}>
                    <Heart className="size-4 mr-2" />
                    관심목록
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/portfolio")}>
                    <Briefcase className="size-4 mr-2" />
                    포트폴리오
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="size-4 mr-2" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="default">로그인</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
