import React, { FormEvent, useState } from "react";
import { Button } from "../components/atoms/button";
import { useClient } from "../supabase/use-client";
import { UserCredentials } from "@supabase/supabase-js";
import { useNavigate } from "react-router";

const EmailVerification = () => {;

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
        Email verification
      </h1>
      <p text="gray-300">
        An email verification request has been sent to your email address.
        To complete the sign up process, please click the link in the email.
      </p>
    </div>
  );
};

export default EmailVerification;
