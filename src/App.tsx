
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import AdminGuard from "@/components/AdminGuard";
import Index from "./pages/Index";
import CustomerLogin from "./pages/customer/Login";
import CustomerRegister from "./pages/customer/Register";
import CustomerDashboard from "./pages/customer/Dashboard";
import DriverLogin from "./pages/driver/Login";
import DriverRegister from "./pages/driver/Register";
import DriverDashboard from "./pages/driver/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/customer">
              <Route path="login" element={<CustomerLogin />} />
              <Route path="register" element={<CustomerRegister />} />
              <Route
                path="dashboard"
                element={
                  <AuthGuard userType="customer">
                    <CustomerDashboard />
                  </AuthGuard>
                }
              />
            </Route>
            <Route path="/driver">
              <Route path="login" element={<DriverLogin />} />
              <Route path="register" element={<DriverRegister />} />
              <Route
                path="dashboard"
                element={
                  <AuthGuard userType="driver">
                    <DriverDashboard />
                  </AuthGuard>
                }
              />
            </Route>
            <Route path="/admin">
              <Route
                path="dashboard"
                element={
                  <AdminGuard>
                    <AdminDashboard />
                  </AdminGuard>
                }
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
