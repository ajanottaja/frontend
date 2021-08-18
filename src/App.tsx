import { useAuth0 } from '@auth0/auth0-react';
import React from 'react'
import {
  Switch,
  Route,
} from "react-router-dom";
import Dashboard from './components/pages/dashboard';

function App() {

  return (
    <div className="bg-light-200 dark:bg-dark-800" w="max-screen" h="full">
      <Switch>
        <Route exact path="/">
          <Dashboard />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/hello">
          <h1>Hello!</h1>
        </Route>
      </Switch>
    </div>
  )
}

export default App
