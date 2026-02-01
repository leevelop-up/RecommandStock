import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "@/app/pages/HomePage";
import { StocksListPage } from "@/app/pages/StocksListPage";
import { ThemeListPage } from "@/app/pages/ThemeListPage";
import { ThemeDetailPage } from "@/app/pages/ThemeDetailPage";
import { LoginPage } from "@/app/pages/LoginPage";
import { AuthCallbackPage } from "@/app/pages/AuthCallbackPage";
import { WatchlistPage } from "@/app/pages/WatchlistPage";
import { PortfolioPage } from "@/app/pages/PortfolioPage";
import { MyPage } from "@/app/pages/MyPage";
import { Header } from "@/app/components/Header";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stocks/:type" element={<StocksListPage />} />
        <Route path="/themes" element={<ThemeListPage />} />
        <Route path="/theme/:id" element={<ThemeDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/auth/google/callback" element={<AuthCallbackPage provider="google" />} />
        <Route path="/auth/kakao/callback" element={<AuthCallbackPage provider="kakao" />} />
        <Route path="/auth/naver/callback" element={<AuthCallbackPage provider="naver" />} />
      </Routes>
    </BrowserRouter>
  );
}
