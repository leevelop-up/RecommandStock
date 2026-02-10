/**
 * API 응답 타입 정의
 * RecommandAi API와 미래 DB 스키마에 호환되는 인터페이스
 */

// 기본 주식 정보 (DB 테이블: stocks)
export interface Stock {
  id: string;                    // 종목 코드 (PK)
  symbol: string;                // 한글명
  name: string;                  // 영문명
  price: number;                 // 현재가
  change: number;                // 전일대비
  changePercent: number;         // 등락률
  marketCap: string;             // 시가총액
  peRatio: number;               // PER
  dividendYield: number;         // 배당수익률
  sector: string;                // 섹터
  recommendation: string;        // 추천의견
  analystRating: number;         // 평점 (1-5)

  // 추가 정보 (optional)
  reasoning?: string;            // 추천 근거
  targetReturn?: string;         // 목표 수익률
  riskFactors?: string[];        // 리스크 요인
  catalysts?: string[];          // 촉매 요인
  volume?: number;               // 거래량
  high?: number;                 // 고가
  low?: number;                  // 저가
  prevClose?: number;            // 전일 종가
}

// 추천 종목 응답 (DB 테이블: recommendations)
export interface RecommendationsResponse {
  generatedAt: string;           // 생성 시간 (timestamp)
  engine: string;                // 엔진 (gemini/rule_based/hybrid)
  marketOverview: {
    summary: string;             // 시장 요약
    sentiment: string;           // 시장 심리 (positive/neutral/negative)
    korea_summary?: string;      // 한국 시장 요약
    usa_summary?: string;        // 미국 시장 요약
  };
  recommendedStocks: Stock[];    // 추천 종목 목록
  themeStocks: Stock[];          // 테마 종목 목록
  topPicks: Stock[];             // TOP 추천
  sectorAnalysis: SectorAnalysis[];
  riskAssessment: RiskAssessment;
}

// 섹터 분석 (DB 테이블: sector_analysis)
export interface SectorAnalysis {
  sector: string;                // 섹터명 (PK)
  outlook: string;               // 전망 (positive/neutral/negative)
  reasoning: string;             // 분석 근거
  top_stocks: string[];          // 주요 종목 목록
  score?: number;                // 섹터 점수 (0-100)
}

// 리스크 평가
export interface RiskAssessment {
  overall_risk: string;          // 전체 리스크
  key_risks: string[];           // 주요 리스크
  opportunities: string[];       // 기회 요인
}

// 급등 예측 종목 (DB 테이블: growth_predictions)
export interface GrowthStock extends Stock {
  predictedReturn: string;       // 예상 수익률
  confidence: string;            // 신뢰도 (High/Medium/Low)
  timeframe: string;             // 예상 기간
  entryPoint?: string;           // 진입가
  stopLoss?: string;             // 손절가
  rank: number;                  // 순위
}

// 급등 예측 응답
export interface GrowthPredictionsResponse {
  generatedAt: string;
  engine: string;
  predictionSummary: string;     // 예측 요약
  growthStocks: GrowthStock[];   // 급등 예측 종목
  hotThemes: HotTheme[];         // 급등 테마
  riskWarning: string;           // 리스크 경고
}

// 테마 정보 (DB 테이블: themes)
export interface Theme {
  id: string;                    // 테마 ID (PK)
  name: string;                  // 테마명
  score: number;                 // 테마 점수 (0-100)
  trend: string;                 // 트렌드 (hot/rising/stable/falling)
  outlook?: string;              // 전망
  reasoning?: string;            // 분석 근거
  stockCount: number;            // 관련 종목 수
  topStocks: string[];           // 대표 종목
}

// 급등 테마
export interface HotTheme extends Theme {
  momentum: string;              // 모멘텀 (강세/약세)
  signal: string;                // 시그널 (매수/관망/매도)
}

// 테마 목록 응답
export interface ThemesResponse {
  themes: Theme[];
}

// 뉴스 아이템 (DB 테이블: news)
export interface NewsItem {
  id?: number;                   // 뉴스 ID (auto increment)
  title: string;                 // 제목
  description: string;           // 요약
  link: string;                  // 링크 (unique)
  source: string;                // 출처
  published: string;             // 발행일시
  ticker?: string;               // 관련 종목 코드
  keyword?: string;              // 키워드
  createdAt?: string;            // DB 저장 시간
}

// 뉴스 응답
export interface NewsResponse {
  news: NewsItem[];
  totalCount: number;
  collectedAt: string;
  ticker?: string;               // 종목별 뉴스인 경우
  keyword?: string;              // 키워드 뉴스인 경우
  stockName?: string;            // 종목명
}

// API 에러 응답
export interface ApiError {
  detail: string;
  status_code?: number;
}
