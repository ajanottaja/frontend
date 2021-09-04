import React, { useEffect, useState, Suspense } from "react";
import {
  Auth0ContextInterface,
  useAuth0,
  User,
  withAuthenticationRequired,
} from "@auth0/auth0-react";
import Header from "../components/layout/header";
import { useHistory } from "react-router-dom";


const Home = () => {
  const history = useHistory();
  const auth0 = useAuth0();

  if (auth0.isLoading) {
    return <div>Is loading</div>;
  }

  if (auth0.error) {
    return <div>Authentication error</div>;
  }

  if (auth0.isAuthenticated) {
    // Redirect authenticated users to the dashboard
    history.push("/dashboard")
  }

  if (!auth0.isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return (
    <div
      display="flex"
      flex="col"
      align="content-center"
      justify="start"
      h="full min-full"
    >
      <Header />
      <div display="flex" flex="col grow" justify="content-center">
        <div
          w="max-w-7xl full"
          justify="self-center items-center"
          align="self-center items-self-stretch"
          display="grid"
          grid="cols-3 <lg:cols-1 lg:gap-x-32 <lg:gap-y-8"
          p="<lg:x-4"
        >
          {/* TODO: Implement a super fancy landing page with some info about project */}
        </div>
      </div>
    </div>
  );
};

export default Home;
