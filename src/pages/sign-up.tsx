import React, { FormEvent, useState } from "react";
import { isError, useMutation } from "@tanstack/react-query";
import { Button } from "../components/atoms/button";
import { useClient } from "../supabase/use-client";
import { UserCredentials } from "@supabase/supabase-js";
import { useNavigate } from "react-router";

const useSignupMutation = () => {
  const client = useClient();
  const navigate = useNavigate();
  const data = useMutation(async (user: UserCredentials) => {
    const { error } = await client.auth.signUp(user);
    if (error) return error;
    navigate("/dashboard");
  });
  return data;
};

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data, isLoading, error, mutate, isError } = useSignupMutation();
  const handleSignup = (e: any) => {
    e.preventDefault();
    mutate({ email, password });
  }

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
        Sign up
      </h1>
      <p text="gray-300">
        Fill out the form to sign up as a user of Ajanottaja.
        <br />
        Already have an account?{" "}
        <a href="/login" text="green-300">
          Login here
        </a>
        .<br />
        Forgot your password?{" "}
        <a href="/forgot" text="green-300">
          Reset it
        </a>
        .<br />
        We recommend you use a{" "}
        <a
          text="green-300"
          title="XKCD password strength"
          href="https://xkcd.com/936/"
        >
          Passphrase
        </a>
        .
      </p>
      {isLoading && "Creating user"}

      {!error && !isLoading && (
        <form onSubmit={handleSignup} display="flex" flex="col" gap="4">
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

export default SignUp;
