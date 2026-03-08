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

console.log("🔧 API_BASE_URL:", API_BASE_URL);
console.log("🔧 VITE_API_URL env:", import.meta.env.VITE_API_URL);

/**
 * API 호출 헬퍼 함수
 */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`📡 API 요청: ${url}`);

  try {
    const response = await fetch(url, options);
    console.log(`📡 API 응답 (${endpoint}):`, response.status, response.statusText);

    if (!response.ok) {
      const error: ApiError = await response.json();
      console.error(`❌ API 에러 (${endpoint}):`, error);
      throw new Error(error.detail || `API Error: ${response.status}`);
    }

    if (response.status === 204) return undefined as T;
    const data = await response.json();
    console.log(`✅ API 성공 (${endpoint}):`, data);
    return data;
  } catch (error) {
    console.error(`❌ API 호출 실패 (${endpoint}):`, error);
    throw error;
  }
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
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

// ── 관심종목 API ─────────────────────────────────────────────────────────────

export interface WatchlistItem {
  id: number;
  ticker: string;
  stock_name: string | null;
  added_at: string;
}

export const watchlistApi = {
  getAll: (): Promise<WatchlistItem[]> =>
    fetchApi("/watchlist", { headers: authHeaders() }),

  add: (ticker: string, stock_name?: string): Promise<WatchlistItem> =>
    fetchApi("/watchlist", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ ticker, stock_name }),
    }),

  remove: (ticker: string): Promise<void> =>
    fetchApi(`/watchlist/${ticker}`, { method: "DELETE", headers: authHeaders() }),
};

// ── 포트폴리오 API ────────────────────────────────────────────────────────────

export interface PortfolioItem {
  id: number;
  ticker: string;
  stock_name: string | null;
  quantity: number;
  avg_price: number;
  updated_at: string;
}

export const portfolioApi = {
  getAll: (): Promise<PortfolioItem[]> =>
    fetchApi("/portfolio", { headers: authHeaders() }),

  buy: (ticker: string, quantity: number, price: number, stock_name?: string): Promise<PortfolioItem> =>
    fetchApi("/portfolio/buy", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ ticker, quantity, price, stock_name }),
    }),

  sell: (ticker: string, quantity: number, price: number): Promise<unknown> =>
    fetchApi("/portfolio/sell", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ ticker, quantity, price }),
    }),
};
