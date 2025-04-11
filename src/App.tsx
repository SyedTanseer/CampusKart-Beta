import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from "@/hooks/use-theme";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SellPage from './pages/SellPage';
import Index from './pages/Index';
import ProductPage from './pages/ProductPage';
import NotFound from './pages/NotFound';
import TextbooksPage from './pages/category/TextbooksPage';
import ElectronicsPage from './pages/category/ElectronicsPage';
import DormSuppliesPage from './pages/category/DormSuppliesPage';
import CourseNotesPage from './pages/category/CourseNotesPage';
import BikesPage from './pages/category/BikesPage';
import AccessoriesPage from './pages/category/AccessoriesPage';
import FurniturePage from './pages/category/FurniturePage';
import ClothingPage from './pages/category/ClothingPage';
import EventTicketsPage from './pages/category/EventTicketsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider defaultTheme="system" storageKey="campuskart-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <Router>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/sell" element={<SellPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/category/textbooks" element={<TextbooksPage />} />
                    <Route path="/category/electronics" element={<ElectronicsPage />} />
                    <Route path="/category/dorm-supplies" element={<DormSuppliesPage />} />
                    <Route path="/category/course-notes" element={<CourseNotesPage />} />
                    <Route path="/category/bikes" element={<BikesPage />} />
                    <Route path="/category/accessories" element={<AccessoriesPage />} />
                    <Route path="/category/furniture" element={<FurniturePage />} />
                    <Route path="/category/clothing" element={<ClothingPage />} />
                    <Route path="/category/event-tickets" element={<EventTicketsPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
                <Toaster />
                <Sonner />
              </Router>
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
