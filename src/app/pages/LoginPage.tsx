import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card } from "@/app/components/ui/card";
import { loginWithGoogle, loginWithKakao, loginWithNaver } from "@/app/utils/socialAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직 구현 예정
    console.log("Login attempt:", { email, password });
    
    // 로그인 성공 시 로컬 스토리지에 저장
    localStorage.setItem("isLoggedIn", "true");
    
    // 홈으로 이동
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">RecommandStock</h1>
          <p className="text-gray-600">로그인하여 시작하세요</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-600">로그인 상태 유지</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              비밀번호 찾기
            </a>
          </div>

          <Button type="submit" className="w-full">
            로그인
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            회원가입
          </Link>
        </div>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Button variant="outline" className="w-full" type="button" onClick={loginWithGoogle}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google로 계속하기
          </Button>

          <Button variant="outline" className="w-full bg-[#FEE500] hover:bg-[#FDD835] border-[#FEE500]" type="button" onClick={loginWithKakao}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C7.03 3 3 6.58 3 11c0 2.75 1.49 5.17 3.75 6.64-.05.76-.37 2.63-.42 2.98-.07.47.17.46.37.34.14-.09 2.26-1.53 2.62-1.78.65.09 1.32.14 2.01.14 4.97 0 9-3.58 9-8s-4.03-8-9-8z" fill="#000000"/>
            </svg>
            <span className="text-black font-medium">Kakao로 계속하기</span>
          </Button>

          <Button variant="outline" className="w-full bg-[#03C75A] hover:bg-[#02B350] border-[#03C75A]" type="button" onClick={loginWithNaver}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
              <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" fill="white"/>
            </svg>
            <span className="text-white font-medium">Naver로 계속하기</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
