import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import ShopPage from "@/pages/shop";
import ProductPage from "@/pages/product";
import CheckoutPage from "@/pages/checkout";
import CheckoutSuccessPage from "@/pages/checkout-success";
import ProtocolFinderPage from "@/pages/protocol-finder";
import OurMethodPage from "@/pages/our-method";
import LearnPage from "@/pages/learn";
import BlogPage from "@/pages/blog";
import BlogPostPage from "@/pages/blog-post";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import CartDrawer from "@/components/CartDrawer";
import ReconstitutionKitPopup from "@/components/ReconstitutionKitPopup";
import AgeGate from "@/components/AgeGate";
import { CartProvider, useCart } from "@/context/CartContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function KitPopupWrapper() {
  const { kitPopupOpen, dismissKitPopup, removeKitAndDismiss } = useCart();
  return (
    <ReconstitutionKitPopup
      open={kitPopupOpen}
      onDismiss={dismissKitPopup}
      onRemove={removeKitAndDismiss}
    />
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={Admin} />
      <Route>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/protocol-finder" component={ProtocolFinderPage} />
              <Route path="/our-method" component={OurMethodPage} />
              <Route path="/learn" component={LearnPage} />
              <Route path="/blog/:slug" component={BlogPostPage} />
              <Route path="/blog" component={BlogPage} />
              <Route path="/shop" component={ShopPage} />
              <Route path="/shop/:slug" component={ProductPage} />
              <Route path="/checkout/success" component={CheckoutSuccessPage} />
              <Route path="/checkout" component={CheckoutPage} />
              <Route path="/terms" component={Terms} />
              <Route path="/privacy" component={Privacy} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
        <ChatWidget />
        <CartDrawer />
        <KitPopupWrapper />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <AdminAuthProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <ScrollToTop />
              <Router />
            </WouterRouter>
            <AgeGate />
            <Toaster />
          </AdminAuthProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
