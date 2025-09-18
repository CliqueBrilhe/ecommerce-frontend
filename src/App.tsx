import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Produtos from "./pages/Produtos";
import Pedidos from "./pages/Pedidos";
import Estatisticas from "./pages/Estatisticas";
import Consult_CPF from "./pages/Consult_Cpf"
import Pedidos_cliente from "./pages/Pedidos-cliente";
import AdminLayout from "./pages/AdminLayout";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/categoria/:category" element={<Index />} />
          <Route path="/pedidos_cliente" element={<Pedidos_cliente />} />
          <Route path="/consult_CPF" element={<Consult_CPF />} />
          
          
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/produtos" replace />} />
              <Route path="produtos" element={<Produtos />} />
              <Route path="pedidos" element={<Pedidos />} />
              <Route path="estatisticas" element={<Estatisticas />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
