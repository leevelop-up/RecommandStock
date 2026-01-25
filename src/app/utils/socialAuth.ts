// Google OAuth
export const loginWithGoogle = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/google/callback`;
  const scope = 'email profile';
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  
  window.location.href = googleAuthUrl;
};

// Kakao OAuth
export const loginWithKakao = () => {
  const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  
  window.location.href = kakaoAuthUrl;
};

// Naver OAuth
export const loginWithNaver = () => {
  const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_NAVER_REDIRECT_URI;
  const state = Math.random().toString(36).substr(2, 11);
  
  // state를 세션 스토리지에 저장 (CSRF 방지)
  sessionStorage.setItem('naver_oauth_state', state);
  
  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
  
  window.location.href = naverAuthUrl;
};

// 콜백 처리 함수들
export const handleGoogleCallback = async (code: string) => {
  try {
    // 백엔드 API에 code를 보내서 사용자 정보를 받아옵니다
    const response = await fetch('/api/auth/google/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // 토큰 저장
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    }
    
    return { success: false, error: data.error };
  } catch (error) {
    console.error('Google login error:', error);
    return { success: false, error: 'Google 로그인에 실패했습니다.' };
  }
};

export const handleKakaoCallback = async (code: string) => {
  try {
    const response = await fetch('/api/auth/kakao/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    }
    
    return { success: false, error: data.error };
  } catch (error) {
    console.error('Kakao login error:', error);
    return { success: false, error: 'Kakao 로그인에 실패했습니다.' };
  }
};

export const handleNaverCallback = async (code: string, state: string) => {
  try {
    // state 검증
    const savedState = sessionStorage.getItem('naver_oauth_state');
    if (state !== savedState) {
      return { success: false, error: 'Invalid state parameter' };
    }
    
    const response = await fetch('/api/auth/naver/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.removeItem('naver_oauth_state');
      return { success: true, user: data.user };
    }
    
    return { success: false, error: data.error };
  } catch (error) {
    console.error('Naver login error:', error);
    return { success: false, error: 'Naver 로그인에 실패했습니다.' };
  }
};
