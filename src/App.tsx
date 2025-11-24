import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";

// --- DEFINISI TIPE UNTUK USER CONTEXT ---
interface UserContextType {
  user: any | null;
  isLoading: boolean;
  login: (user: any) => void;
  logout: () => void;
}

// --- CONTEXT & HOOK ---
const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

// --- PROVIDER UTAMA USER ---
const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      setUser(JSON.parse(u));
    }
    setIsLoading(false);
  }, []);

  const login = (userObj: any) => {
    setUser(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "https://zaidnetutama.vercel.app/"; // ✅ Tambahkan ini di sini
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// --- ROUTE PROTECTION ---
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useUser();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// --- REDIRECT LOGIN JIKA SUDAH LOGIN ---
const LoginRedirect = () => {
  const { user, isLoading } = useUser();

  if (isLoading) return null;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <LoginPage />;
};

// --- APP ---
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/login" element={<LoginRedirect />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

