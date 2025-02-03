import { SignInWithPasswordCredentials } from "@supabase/supabase-js";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Button } from "../components/atoms/button";
import { useClient } from "../supabase/use-client";

const useSigninMutation = () => {
  const client = useClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (user: SignInWithPasswordCredentials) => {
      console.log("Signing in...");
      const { error } = await client.auth.signInWithPassword(user);
      if (error) throw error;
      navigate("/dashboard");
    }
  });
};

const InputField = ({ 
  id, 
  type, 
  placeholder, 
  value, 
  onChange 
}: { 
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="relative group">
    {/* Gradient border that shows on focus */}
    <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-green-600 to-teal-600 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100" />
    
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="block w-full px-4 py-3 bg-stone-800 border border-stone-600 rounded-lg text-gray-300 placeholder-gray-500 relative z-10 transition-colors duration-200 focus:border-transparent focus:outline-none focus:ring-0"
    />
  </div>
);

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isPending, error, mutate } = useSigninMutation();
  const handleLogin = () => mutate({ email, password });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-gradient-to-br from-green-400 to-teal-400 bg-clip-text hover:from-green-300 hover:to-teal-300">
          Sign in
        </h1>
        
        <p className="text-gray-400 text-center mb-8">
          Fill out the form to sign in as a user of Ajanottaja.
          <br />
          If you don't have an account{" "}
          <a 
            href="/signup" 
            className="text-transparent bg-gradient-to-br from-green-400 to-teal-400 bg-clip-text hover:from-green-300 hover:to-teal-300"
          >
            sign up here
          </a>
          .<br />
          Forgot your password?{" "}
          <a 
            href="/forgot" 
            className="text-transparent bg-gradient-to-br from-green-400 to-teal-400 bg-clip-text hover:from-green-300 hover:to-teal-300"
          >
            Reset it
          </a>
          .
        </p>

        {isPending && (
          <div className="text-center text-gray-400">
            Logging in...
          </div>
        )}

        {!error && !isPending && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <InputField
                id="email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Passphrase
              </label>
              <InputField
                id="password"
                type="password"
                placeholder="correct horse battery staple"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg text-white font-medium hover:from-green-500 hover:to-teal-500 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-stone-800"
            >
              Sign In
            </button>
          </form>
        )}

        {error && (
          <div className="mt-4 text-red-400 text-center">
            Failed to sign in. Please check your credentials and try again.
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
