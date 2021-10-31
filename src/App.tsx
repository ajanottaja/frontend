import { withAuthenticationRequired } from "@auth0/auth0-react";
import React, { ReactNode } from "react";
import { Switch, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import Calendar from "./pages/calendar";
import { MainMenu, MobileMenu } from "./components/organisms/menu";
import CreateMenu from "./components/molecules/create-menu";
import { useSWRConfig } from "swr";
import { SwrMutateProvider } from "./components/providers/swr-mutation-provider";

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
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/calendar" component={Calendar} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
