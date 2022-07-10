import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "./supabase/auth-provider";
import { MainMenu, MobileMenu } from "./components/organisms/menu";
import CreateMenu from "./components/molecules/create-menu";
import Loading from "./components/layout/loading-page";

// Lazy load components to enable code splitting
const Home = React.lazy(() => import("./pages/home"));
const Dashboard = React.lazy(() => import("./pages/dashboard"));
// const Calendar = React.lazy(() => import("./pages/calendar"));
// const Statistics = React.lazy(() => import("./pages/statistics"));
const SignUp = React.lazy(() => import("./pages/sign-up"));
const SignIn = React.lazy(() => import("./pages/sign-in"));


const AuthorizedLayout = ({
  redirectPath = "/signin"
}) => {
  const { session, user, loading } = useAuth();
  if (!loading && !session) {
    console.log('Session', session)
    console.log('User', user)
    return <Navigate to={redirectPath} replace />;
  }

  return <div
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
        <Outlet />
    </div>
  </div>
}

const PublicLayout = () => (
  <div
      display="flex"
      flex="col"
      w="full"
      justify="items-center"
      align="items-center"
    >
      <Outlet />
    </div>
)

function App() {
  console.log("Render app");
  return (

  <React.Suspense fallback={<Loading />}>
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={ <SignIn />} />
      </Route>
      <Route element={<AuthorizedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/calendar" element={<Calendar />} />
          <Route path="/statistics" element={<Statistics />} /> */}
      </Route>
    </Routes>
  </React.Suspense>
  );
}

export default App;
