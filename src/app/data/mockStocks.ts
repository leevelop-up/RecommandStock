import { Stock } from "@/app/components/StockCard";

export const mockRecommendedStocks: Stock[] = [
  {
    id: "1",
    symbol: "삼성전자",
    name: "Samsung Electronics",
    price: 71500,
    change: 1200,
    changePercent: 1.71,
    marketCap: "427조원",
    peRatio: 15.2,
    dividendYield: 2.8,
    sector: "반도체",
    recommendation: "Strong Buy",
    analystRating: 4.7,
  },
  {
    id: "2",
    symbol: "SK하이닉스",
    name: "SK Hynix",
    price: 142000,
    change: 3500,
    changePercent: 2.53,
    marketCap: "103조원",
    peRatio: 18.5,
    dividendYield: 1.2,
    sector: "반도체",
    recommendation: "Strong Buy",
    analystRating: 4.8,
  },
  {
    id: "3",
    symbol: "NAVER",
    name: "Naver Corporation",
    price: 198500,
    change: 2500,
    changePercent: 1.28,
    marketCap: "32조원",
    peRatio: 22.3,
    dividendYield: 0.5,
    sector: "IT서비스",
    recommendation: "Strong Buy",
    analystRating: 4.5,
  },
  {
    id: "4",
    symbol: "카카오",
    name: "Kakao Corp",
    price: 48900,
    change: 850,
    changePercent: 1.77,
    marketCap: "21조원",
    peRatio: 28.1,
    dividendYield: 0.3,
    sector: "IT서비스",
    recommendation: "Buy",
    analystRating: 4.2,
  },
];

export const mockThemeStocks: Stock[] = [
  {
    id: "5",
    symbol: "에코프로비엠",
    name: "EcoPro BM",
    price: 285000,
    change: 12000,
    changePercent: 4.4,
    marketCap: "18조원",
    peRatio: 35.2,
    dividendYield: 0.1,
    sector: "2차전지",
    recommendation: "Strong Buy",
    analystRating: 4.6,
  },
  {
    id: "6",
    symbol: "포스코홀딩스",
    name: "POSCO Holdings",
    price: 398000,
    change: 5500,
    changePercent: 1.4,
    marketCap: "34조원",
    peRatio: 12.8,
    dividendYield: 3.5,
    sector: "2차전지",
    recommendation: "Buy",
    analystRating: 4.3,
  },
  {
    id: "7",
    symbol: "LG에너지솔루션",
    name: "LG Energy Solution",
    price: 425000,
    change: 8000,
    changePercent: 1.92,
    marketCap: "99조원",
    peRatio: 42.1,
    dividendYield: 0.8,
    sector: "2차전지",
    recommendation: "Strong Buy",
    analystRating: 4.7,
  },
  {
    id: "8",
    symbol: "삼성바이오로직스",
    name: "Samsung Biologics",
    price: 892000,
    change: -5000,
    changePercent: -0.56,
    marketCap: "61조원",
    peRatio: 38.5,
    dividendYield: 0.2,
    sector: "바이오",
    recommendation: "Buy",
    analystRating: 4.4,
  },
  {
    id: "9",
    symbol: "셀트리온",
    name: "Celltrion",
    price: 178500,
    change: 3200,
    changePercent: 1.83,
    marketCap: "24조원",
    peRatio: 25.7,
    dividendYield: 1.1,
    sector: "바이오",
    recommendation: "Strong Buy",
    analystRating: 4.5,
  },
  {
    id: "10",
    symbol: "현대차",
    name: "Hyundai Motor",
    price: 215000,
    change: 4500,
    changePercent: 2.14,
    marketCap: "46조원",
    peRatio: 6.8,
    dividendYield: 4.2,
    sector: "자동차",
    recommendation: "Buy",
    analystRating: 4.1,
  },
];

export const generateChartData = (currentPrice: number) => {
  const data = [];
  let price = currentPrice * 0.85;
  const months = ["7월", "8월", "9월", "10월", "11월", "12월", "1월"];

  for (let i = 0; i < months.length; i++) {
    price += (Math.random() - 0.4) * (currentPrice * 0.05);
    data.push({
      date: months[i],
      price: parseFloat(price.toFixed(2)),
    });
  }

  data[data.length - 1].price = currentPrice;

  return data;
};
