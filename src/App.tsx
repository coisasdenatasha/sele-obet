import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import BetSlipPanel from "@/components/BetSlipPanel";
import HomePage from "@/pages/HomePage";
import LivePage from "@/pages/LivePage";
import SearchPage from "@/pages/SearchPage";
import WalletPage from "@/pages/WalletPage";
import ProfilePage from "@/pages/ProfilePage";
import AuthPage from "@/pages/AuthPage";
import EventDetailPage from "@/pages/EventDetailPage";
import BolaoPage from "@/pages/BolaoPage";
import PlansPage from "@/pages/PlansPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const AppLayout = () => {
  const [betSlipOpen, setBetSlipOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto pt-2">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ao-vivo" element={<LivePage />} />
          <Route path="/busca" element={<SearchPage />} />
          <Route path="/carteira" element={<WalletPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/evento/:id" element={<EventDetailPage />} />
          <Route path="/bolao" element={<BolaoPage />} />
          <Route path="/planos" element={<PlansPage />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BottomNav onBetSlipToggle={() => setBetSlipOpen(!betSlipOpen)} />
      <BetSlipPanel isOpen={betSlipOpen} onClose={() => setBetSlipOpen(false)} />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
