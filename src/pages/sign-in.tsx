import { UserCredentials } from "@supabase/supabase-js";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import { Button } from "../components/atoms/button";
import { useClient } from "../supabase/use-client";

const useSigninMutation = () => {
  const client = useClient();
  const navigate = useNavigate();
  const data = useMutation(async (user: UserCredentials) => {
    await client.auth.signIn(user, { redirectTo: "/dashboard" });
    navigate("/dashboard");
  });
  return data;
};

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data, isLoading, error, mutate } = useSigninMutation();
  const handleLogin = () => mutate({ email, password });

  return (
    <div
      h="min-screen"
      display="flex"
      flex="col"
      justify="center"
      w="max-96 full"
      text="center"
    >
      <h1 text="green-300 4xl" m="b-8">
        Sign in
      </h1>
      <p text="gray-300">
        Fill out the form to sign in as a user of Ajanottaja.
        <br />
        If you don't have an account{" "}
        <a href="/signup" text="green-300">
          sign up here
        </a>
        .<br />
        Forgot your password?{" "}
        <a href="/forgot" text="green-300">
          Reset it
        </a>
        .
      </p>
      {isLoading && "Logging in"}
      {!error && !isLoading && (
        <form onSubmit={handleLogin} display="flex" flex="col" gap="4">
          <label htmlFor="email" text="left gray-300" m="b-2">
            Email
            <input
              id="email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              display="flex"
              flex="row"
              align="items-center"
              justify="between"
              bg="dark-500"
              border="1 rounded dark-50"
              p="2"
              w="full"
              text="gray-300"
            />
          </label>

          <label htmlFor="password" text="left gray-300" m="b-2">
            Passphrase
            <input
              id="password"
              className="inputField"
              type="password"
              placeholder="correct horse battery staple"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              flex="row"
              align="items-center"
              justify="between"
              bg="dark-500"
              border="1 rounded dark-50"
              p="2"
              w="full"
              text="gray-300"
            />
          </label>

          <Button>Submit</Button>
        </form>
      )}
    </div>
  );
};

export default SignIn;
