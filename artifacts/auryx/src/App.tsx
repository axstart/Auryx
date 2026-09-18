import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import Home from "@/pages/home";
import { CartProvider, useCart } from "@/context/CartContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { LanguageProvider, initialLang } from "@/i18n";
import { ageGateRequired } from "@/lib/age-gate";

const NotFound = lazy(() => import("@/pages/not-found"));
const Admin = lazy(() => import("@/pages/admin"));
const AdminLogin = lazy(() => import("@/pages/admin-login"));
const Terms = lazy(() => import("@/pages/terms"));
const Privacy = lazy(() => import("@/pages/privacy"));
const Contact = lazy(() => import("@/pages/contact"));
const Sources = lazy(() => import("@/pages/sources"));
const Disclaimer = lazy(() => import("@/pages/disclaimer"));
const ShopPage = lazy(() => import("@/pages/shop"));
const ProductPage = lazy(() => import("@/pages/product"));
const CheckoutPage = lazy(() => import("@/pages/checkout"));
const CheckoutSuccessPage = lazy(() => import("@/pages/checkout-success"));
const ProtocolFinderPage = lazy(() => import("@/pages/protocol-finder"));
const OurMethodPage = lazy(() => import("@/pages/our-method"));
const AboutPage = lazy(() => import("@/pages/about"));
const NewYorkPage = lazy(() => import("@/pages/new-york"));
const LearnPage = lazy(() => import("@/pages/learn"));
const BlogPage = lazy(() => import("@/pages/blog"));
const BlogPostPage = lazy(() => import("@/pages/blog-post"));
const VerifyCoaPage = lazy(() => import("@/pages/verify-coa"));
const ChatWidget = lazy(() => import("@/components/ChatWidget"));
const CartDrawer = lazy(() => import("@/components/CartDrawer"));
const ReconstitutionKitPopup = lazy(() => import("@/components/ReconstitutionKitPopup"));
const Analytics = lazy(() => import("@/components/Analytics"));
const WebVitals = lazy(() => import("@/components/WebVitals"));

const queryClient = new QueryClient();

const envBase = import.meta.env.BASE_URL.replace(/\/$/, "");
// Mount the router under the language prefix so all routes/links stay in-language.
const routerBase = initialLang === "en" ? envBase : `${envBase}/${initialLang}`;

const routeFallback = (
  <div className="min-h-[100dvh] bg-[#0A0A0A]" aria-hidden />
);

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

/** Keep the HTML hero mounted on the homepage so its H1 and image stay the LCP nodes. */
function LcpHeroGate() {
  const [location] = useLocation();
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("lcp-home", location === "/");
  }, [location]);
  return null;
}

function KitPopupWrapper() {
  const { kitPopupOpen, dismissKitPopup, removeKitAndDismiss } = useCart();
  if (!kitPopupOpen) return null;
  return (
    <Suspense fallback={null}>
      <ReconstitutionKitPopup
        open={kitPopupOpen}
        onDismiss={dismissKitPopup}
        onRemove={removeKitAndDismiss}
      />
    </Suspense>
  );
}

function MaybeAgeGate() {
  const [needed] = useState(() => ageGateRequired());
  if (!needed) return null;
  return <AgeGate />;
}

function Router() {
  return (
    <Suspense fallback={routeFallback}>
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={Admin} />
        <Route>
          <div className="flex min-h-[100dvh] flex-col">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<div className="min-h-[50vh] bg-[#0A0A0A]" aria-hidden />}>
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/protocol-finder" component={ProtocolFinderPage} />
                  <Route path="/our-method" component={OurMethodPage} />
                  <Route path="/about" component={AboutPage} />
                  <Route path="/peptide-therapy-new-york" component={NewYorkPage} />
                  <Route path="/learn" component={LearnPage} />
                  <Route path="/blog/:slug" component={BlogPostPage} />
                  <Route path="/blog" component={BlogPage} />
                  <Route path="/shop" component={ShopPage} />
                  <Route path="/shop/:slug" component={ProductPage} />
                  <Route path="/checkout/success" component={CheckoutSuccessPage} />
                  <Route path="/checkout" component={CheckoutPage} />
                  <Route path="/terms" component={Terms} />
                  <Route path="/privacy" component={Privacy} />
                  <Route path="/contact" component={Contact} />
                  <Route path="/sources" component={Sources} />
                  <Route path="/disclaimer" component={Disclaimer} />
                  <Route path="/verify-coa" component={VerifyCoaPage} />
                  <Route component={NotFound} />
                </Switch>
              </Suspense>
            </main>
            <Footer />
          </div>
          <Suspense fallback={null}>
            <ChatWidget />
            <CartDrawer />
          </Suspense>
          <KitPopupWrapper />
        </Route>
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <CartProvider>
            <AdminAuthProvider>
              <WouterRouter base={routerBase}>
                <ScrollToTop />
                <LcpHeroGate />
                <Suspense fallback={null}>
                  <Analytics />
                  <WebVitals />
                </Suspense>
                <Router />
              </WouterRouter>
              <MaybeAgeGate />
              <Toaster />
            </AdminAuthProvider>
          </CartProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
