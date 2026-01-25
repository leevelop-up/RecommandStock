import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleGoogleCallback, handleKakaoCallback, handleNaverCallback } from "@/app/utils/socialAuth";

interface AuthCallbackPageProps {
  provider: 'google' | 'kakao' | 'naver';
}

export function AuthCallbackPage({ provider }: AuthCallbackPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      
      if (!code) {
        console.error('No authorization code found');
        navigate('/login');
        return;
      }

      let result;

      switch (provider) {
        case 'google':
          result = await handleGoogleCallback(code);
          break;
        case 'kakao':
          result = await handleKakaoCallback(code);
          break;
        case 'naver':
          const state = searchParams.get('state');
          if (!state) {
            console.error('No state parameter found');
            navigate('/login');
            return;
          }
          result = await handleNaverCallback(code, state);
          break;
      }

      if (result.success) {
        // 로그인 성공 시 홈으로 이동
        navigate('/');
      } else {
        // 실패 시 로그인 페이지로 이동
        console.error(`${provider} login failed:`, result.error);
        navigate('/login');
      }
    };

    processCallback();
  }, [provider, searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}
