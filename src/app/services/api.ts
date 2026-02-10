/**
 * RecommandAi API 서비스
 * FastAPI 백엔드와 통신
 */

import type {
  RecommendationsResponse,
  GrowthPredictionsResponse,
  ThemesResponse,
  NewsResponse,
  Theme,
  ApiError,
} from "@/app/types/api";

// API 기본 URL (환경변수로 관리)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/**
 * API 호출 헬퍼 함수
 */
async function fetchApi<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || `API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API 호출 실패: ${endpoint}`, error);
    throw error;
  }
}

/**
 * 추천 종목 API
 */
export const recommendationsApi = {
  /**
   * 오늘의 AI 추천 종목
   */
  getToday: async (): Promise<RecommendationsResponse> => {
    return fetchApi<RecommendationsResponse>("/recommendations/today");
  },

  /**
   * 급등 예측 종목
   */
  getGrowth: async (): Promise<GrowthPredictionsResponse> => {
    return fetchApi<GrowthPredictionsResponse>("/recommendations/growth");
  },

  /**
   * 시장 요약 정보
   */
  getSummary: async () => {
    return fetchApi("/recommendations/summary");
  },
};

/**
 * 테마/섹터 API
 */
export const themesApi = {
  /**
   * 전체 테마 목록
   */
  getAll: async (): Promise<ThemesResponse> => {
    return fetchApi<ThemesResponse>("/themes");
  },

  /**
   * 급등 테마
   */
  getHot: async () => {
    return fetchApi("/themes/hot");
  },

  /**
   * 테마 상세 정보
   */
  getDetail: async (themeId: string): Promise<Theme> => {
    return fetchApi<Theme>(`/themes/${themeId}`);
  },
};

/**
 * 뉴스 API
 */
export const newsApi = {
  /**
   * 시장 뉴스
   */
  getMarket: async (limit: number = 20): Promise<NewsResponse> => {
    return fetchApi<NewsResponse>(`/news/market?limit=${limit}`);
  },

  /**
   * 종목별 뉴스
   */
  getStock: async (ticker: string, limit: number = 10): Promise<NewsResponse> => {
    return fetchApi<NewsResponse>(`/news/stock/${ticker}?limit=${limit}`);
  },

  /**
   * 키워드 뉴스 검색
   */
  searchKeyword: async (keyword: string, limit: number = 10): Promise<NewsResponse> => {
    return fetchApi<NewsResponse>(`/news/keyword/${keyword}?limit=${limit}`);
  },
};

/**
 * 통합 API (모든 데이터 한번에)
 */
export const getAllData = async () => {
  try {
    const [recommendations, growth, themes, news] = await Promise.all([
      recommendationsApi.getToday(),
      recommendationsApi.getGrowth(),
      themesApi.getAll(),
      newsApi.getMarket(20),
    ]);

    return {
      recommendations,
      growth,
      themes,
      news,
    };
  } catch (error) {
    console.error("통합 데이터 로드 실패:", error);
    throw error;
  }
};

/**
 * API 상태 체크
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL.replace("/api", "")}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
