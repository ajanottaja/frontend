import { withAuthenticationRequired } from '@auth0/auth0-react';
import React, { ReactNode } from 'react'
import {
  Switch,
  Route,
} from "react-router-dom";
import Dashboard from './components/pages/dashboard';

const ProtectedRoute = ({ component, ...args }: {component: React.ComponentType<any>, path: string}) => (
  <Route component={withAuthenticationRequired(component)} {...args} />
);

function App() {

  return (
    <div className="bg-light-200 dark:bg-dark-800" w="max-screen" h="min-screen">
      <Switch>
        <Route exact path="/">
          <Dashboard />
        </Route>
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <Route path="/hello">
          <h1>Hello!</h1>
        </Route>
      </Switch>
    </div>
  )
}

export default App
