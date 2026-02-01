import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Input } from "@/app/components/ui/input";
import { 
  Bell, 
  User, 
  Shield, 
  Palette,
  LogOut,
  Mail,
  Lock,
  Globe,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [newsAlerts, setNewsAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    alert('설정이 저장되었습니다!');
    onClose();
  };

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      alert('로그아웃되었습니다.');
      onClose();
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      alert('계정 삭제가 요청되었습니다.');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">설정</DialogTitle>
          <DialogDescription>
            계정 및 알림 설정을 관리하세요
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="account" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="account">계정</TabsTrigger>
            <TabsTrigger value="notifications">알림</TabsTrigger>
            <TabsTrigger value="security">보안</TabsTrigger>
            <TabsTrigger value="display">화면</TabsTrigger>
          </TabsList>

          {/* 계정 설정 */}
          <TabsContent value="account" className="space-y-4 mt-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="size-5 text-gray-600" />
                <h3 className="text-lg font-semibold">계정 정보</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">이름</Label>
                  <Input id="name" defaultValue="김투자" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue="investor@example.com" 
                    className="mt-2" 
                  />
                </div>
                <div>
                  <Label htmlFor="phone">전화번호</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="010-0000-0000" 
                    className="mt-2" 
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="size-5 text-gray-600" />
                <h3 className="text-lg font-semibold">언어 설정</h3>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="language" defaultChecked />
                  <span>한국어</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="language" />
                  <span>English</span>
                </label>
              </div>
            </Card>
          </TabsContent>

          {/* 알림 설정 */}
          <TabsContent value="notifications" className="space-y-4 mt-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="size-5 text-gray-600" />
                <h3 className="text-lg font-semibold">알림 환경설정</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">이메일 알림</p>
                    <p className="text-sm text-gray-500">중요한 업데이트를 이메일로 받습니다</p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">푸시 알림</p>
                    <p className="text-sm text-gray-500">실시간 알림을 받습니다</p>
                  </div>
                  <Switch 
                    checked={pushNotifications} 
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">가격 알림</p>
                    <p className="text-sm text-gray-500">관심 종목의 가격 변동 알림</p>
                  </div>
                  <Switch 
                    checked={priceAlerts} 
                    onCheckedChange={setPriceAlerts}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">뉴스 알림</p>
                    <p className="text-sm text-gray-500">관련 뉴스 및 시장 동향</p>
                  </div>
                  <Switch 
                    checked={newsAlerts} 
                    onCheckedChange={setNewsAlerts}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* 보안 설정 */}
          <TabsContent value="security" className="space-y-4 mt-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="size-5 text-gray-600" />
                <h3 className="text-lg font-semibold">보안</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">현재 비밀번호</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    placeholder="현재 비밀번호 입력" 
                    className="mt-2" 
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">새 비밀번호</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    placeholder="새 비밀번호 입력" 
                    className="mt-2" 
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="새 비밀번호 확인" 
                    className="mt-2" 
                  />
                </div>
                <Button variant="outline" className="w-full mt-2">
                  <Lock className="size-4 mr-2" />
                  비밀번호 변경
                </Button>
              </div>
            </Card>

            <Card className="p-6 border-red-200 bg-red-50">
              <h3 className="text-lg font-semibold mb-4 text-red-900">위험 구역</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-red-300 hover:bg-red-100"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4 mr-2" />
                  로그아웃
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleDeleteAccount}
                >
                  계정 삭제
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* 화면 설정 */}
          <TabsContent value="display" className="space-y-4 mt-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="size-5 text-gray-600" />
                <h3 className="text-lg font-semibold">화면 설정</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {darkMode ? (
                      <Moon className="size-5 text-gray-600" />
                    ) : (
                      <Sun className="size-5 text-gray-600" />
                    )}
                    <div>
                      <p className="font-medium">다크 모드</p>
                      <p className="text-sm text-gray-500">어두운 테마 사용</p>
                    </div>
                  </div>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">차트 스타일</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="chart" defaultChecked />
                  <span>라인 차트</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="chart" />
                  <span>캔들 차트</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="chart" />
                  <span>바 차트</span>
                </label>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 저장 버튼 */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            취소
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
