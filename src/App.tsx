import React, { useState, Suspense } from 'react'
import logo from './logo.svg'
import { useAuth0 } from '@auth0/auth0-react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Header from './components/layout/header';
import Dashboard from './components/pages/dashboard';

function App() {
  const [count, setCount] = useState(0)
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
  } = useAuth0();


  return (
    <div className="bg-gray-100 dark:bg-gray-800 min-h-screen">
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
