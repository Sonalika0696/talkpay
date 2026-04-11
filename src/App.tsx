import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { BottomNav } from "@/components/BottomNav";
import Index from "./pages/Index";
import Pay from "./pages/Pay";
import History from "./pages/History";
import VoiceHistory from "./pages/VoiceHistory";
import Signup from "./pages/Signup";
import Accounts from "./pages/Accounts";
import Advisory from "./pages/Advisory";
import FinancialCalendar from "./pages/FinancialCalendar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const authed = (el: React.ReactNode) => isAuthenticated ? el : <Index />;

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pay" element={authed(<Pay />)} />
        <Route path="/history" element={authed(<History />)} />
        <Route path="/voice-history" element={authed(<VoiceHistory />)} />
        <Route path="/accounts" element={authed(<Accounts />)} />
        <Route path="/advisory" element={authed(<Advisory />)} />
        <Route path="/calendar" element={authed(<FinancialCalendar />)} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {isAuthenticated && <BottomNav />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
