import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AIChat from "./components/AIChat";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./contexts/ThemeContext";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import BuildPage from "./pages/BuildPage";
import CommunityPage from "./pages/CommunityPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";
import ExplodedPage from "./pages/ExplodedPage";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import PricingPage from "./pages/PricingPage";
import SimulatePage from "./pages/SimulatePage";

const queryClient = new QueryClient();

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col theme-root">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AIChat />
      <Toaster position="top-right" />
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const buildRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/build",
  component: BuildPage,
});
const simulateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/simulate",
  component: SimulatePage,
});
const explodedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/exploded",
  component: ExplodedPage,
});
const learnRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/learn",
  component: LearnPage,
});
const communityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/community",
  component: CommunityPage,
});
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});
const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pricing",
  component: PricingPage,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  buildRoute,
  simulateRoute,
  explodedRoute,
  learnRoute,
  communityRoute,
  dashboardRoute,
  pricingRoute,
  contactRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}
