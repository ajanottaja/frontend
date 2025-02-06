import React, { Fragment } from "react";
import { Navigate, Outlet, Route, Routes, Link, NavLink } from "react-router-dom";
import { useAuth } from "./supabase/auth-provider";
import { MainMenu, MobileMenu } from "./components/organisms/menu";
import Loading from "./components/layout/loading-page";
import { Menu, Transition } from "@headlessui/react";
import { useClient } from "./supabase/use-client";

// Lazy load components to enable code splitting
const Home = React.lazy(() => import("./pages/home"));
const Dashboard = React.lazy(() => import("./pages/dashboard"));
const Calendar = React.lazy(() => import("./pages/calendar"));
const Statistics = React.lazy(() => import("./pages/statistics"));
const SignUp = React.lazy(() => import("./pages/sign-up"));
const SignIn = React.lazy(() => import("./pages/sign-in"));
const EmailVerification = React.lazy(
  () => import("./pages/email-verification")
);

const AuthorizedLayout = ({ redirectPath = "/signin" }) => {
  const { session, user, loading } = useAuth();
  const client = useClient();
  if (!loading && !session) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen bg-stone-900">
      {/* Modern top navigation bar */}
      <header className="fixed top-0 left-0 right-0 bg-stone-900/80 backdrop-blur-lg border-b border-stone-800/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                Ajanottaja
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-stone-800 text-green-400'
                      : 'text-gray-300 hover:text-green-400 hover:bg-stone-800/50'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/calendar"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-stone-800 text-green-400'
                      : 'text-gray-300 hover:text-green-400 hover:bg-stone-800/50'
                  }`
                }
              >
                Calendar
              </NavLink>
              <NavLink
                to="/statistics"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-stone-800 text-green-400'
                      : 'text-gray-300 hover:text-green-400 hover:bg-stone-800/50'
                  }`
                }
              >
                Statistics
              </NavLink>
              
              {/* Profile/Logout Menu */}
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center text-gray-300 hover:text-green-400">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user?.email?.[0].toUpperCase()}
                    </span>
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-stone-800 shadow-lg ring-1 ring-stone-700 focus:outline-none">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-400 border-b border-stone-700">
                        {user?.email}
                      </div>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => client.auth.signOut()}
                            className={`${
                              active ? 'bg-stone-700 text-green-400' : 'text-gray-300'
                            } group flex w-full items-center px-4 py-2 text-sm`}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Update main content area to center vertically */}
      <main className="pt-16 min-h-[calc(100vh-4rem)] flex">
        <div className="max-w-7xl w-full mx-auto px-6 md:px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const PublicLayout = () => {
  const { session, loading } = useAuth();

  if(!loading && session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <div className="flex flex-col w-full justify-items-center items-center">
    <Outlet />
  </div>
}

function App() {
  return (
    <React.Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/email-verification" element={<EmailVerification />} />
        </Route>
        <Route element={<AuthorizedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/statistics" element={<Statistics />} />
        </Route>
      </Routes>
    </React.Suspense>
  );
}

export default App;
