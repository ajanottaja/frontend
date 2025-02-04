import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../supabase";
import { useClient } from "../../supabase/use-client";

const Header = () => {
  const { session } = useAuth();
  const client = useClient();

  return (
    <header className="w-full bg-stone-700 shadow-dark-50">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="text-green-800 dark:text-green-200">
              Ajanottaja
            </Link>
          </div>
          <nav className="flex space-x-5">
            <Link
              to="/dashboard"
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Dashboard
            </Link>
            <Link
              to="/statistics"
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Statistics
            </Link>
          </nav>
          <div className="flex items-center justify-end flex-1 lg:w-0 space-x-5">
            {!session && (
              <Link
                to="/signup"
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Sign up
              </Link>
            )}
            {session ? (
              <button
                onClick={async () => {
                  const { error } = await client.auth.signOut();
                  if (error) console.error('Error signing out:', error);
                }}
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/signin"
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
