import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Switch>
              <Route path="/" component={Home} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
        <ChatWidget />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
