import { withAuthenticationRequired } from "@auth0/auth0-react";
import React, { ReactNode } from "react";
import { Switch, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import Calendar from "./pages/calendar";

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
      h="min-full"
    >
      <Switch>
        <Route exact path="/" component={Home}>
        </Route>
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <ProtectedRoute path="/calendar" component={Calendar} />
      </Switch>
    </div>
  );
}

export default App;
