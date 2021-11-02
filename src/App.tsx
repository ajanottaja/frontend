import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import { Switch, Route } from "react-router-dom";
import { MainMenu, MobileMenu } from "./components/organisms/menu";
import CreateMenu from "./components/molecules/create-menu";
import Loading from "./components/layout/loading-page";

// Lazy load components to enable code splitting
const Home = React.lazy(() => import('./pages/statistics'));
const Dashboard = React.lazy(() => import('./pages/dashboard'));
const Calendar = React.lazy(() => import('./pages/calendar'));
const Statistics = React.lazy(() => import('./pages/statistics'));


const ProtectedRoute = ({
  component,
  ...args
}: {
  component: React.ComponentType<any>;
  path: string;
}) => <Route component={withAuthenticationRequired(component)} {...args} />;

function App() {
  return (
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
        <React.Suspense fallback={<Loading />}>
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <ProtectedRoute path="/dashboard" component={Dashboard} />
            <ProtectedRoute path="/calendar" component={Calendar} />
            <ProtectedRoute path="/statistics" component={Statistics} />
          </Switch>
        </React.Suspense>
      </div>
    </div>
  );
}

export default App;
