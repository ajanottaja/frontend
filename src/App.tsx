import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { MainMenu, MobileMenu } from "./components/organisms/menu";
import CreateMenu from "./components/molecules/create-menu";
import Loading from "./components/layout/loading-page";

// Lazy load components to enable code splitting
const Home = React.lazy(() => import("./pages/home"));
const Dashboard = React.lazy(() => import("./pages/dashboard"));
const Calendar = React.lazy(() => import("./pages/calendar"));
const Statistics = React.lazy(() => import("./pages/statistics"));

interface Authenticated {
  children: JSX.Element;
}

const Authenticated = withAuthenticationRequired(
  ({ children }: Authenticated) => {
    return <>{children}</>;
  }
);

const Layout = () => (
  <div
    className="bg-light-200 dark:bg-dark-800"
    w="max-full"
    h="min-full full"
    display="flex"
    flex="row <sm:col"
  >
    <div pos="fixed bottom-0 right-0" z="50">
      <CreateMenu />
    </div>
    <MainMenu />
    <MobileMenu />
    <div m="md:t-8" w="full">
        <Authenticated>
          <Outlet />
        </Authenticated>
    </div>
  </div>
);

function App() {
  console.log("Render app");
  return (

  <React.Suspense fallback={<Loading />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/statistics" element={<Statistics />} />
      </Route>
    </Routes>
  </React.Suspense>
  );
}

export default App;
