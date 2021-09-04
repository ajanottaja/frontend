import React from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import {
  Link
} from "react-router-dom";

const Header = () => {
  const {
    isAuthenticated,
    logout,
    loginWithPopup
  } = useAuth0();

  return <header bg="dark:dark-700" shadow="dark-50" className="w-full">
    <div className="max-w-7xl mx-auto" p="x-2">
      <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <Link to="/" className="text-green-800 dark:text-green-200">
            Ajanottaja
          </Link>
        </div>
        <nav className="flex space-x-5">
          <Link to="/dashboard" className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">Dashboard</Link>
          <Link to="/statistics" className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">Statistics</Link>
        </nav>
        <div className="flex items-center justify-end flex-1 lg:w-0 space-x-5">
          {!isAuthenticated && <Link to="/dashboard" className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">Sign up</Link>}
          {isAuthenticated ?
          <button onClick={() => logout({returnTo: window.location.href})} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">Logout</button> :
          <button onClick={() => loginWithPopup()} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">Login</button>}
        </div>
      </div>
    </div>
  </header>

}

export default Header;