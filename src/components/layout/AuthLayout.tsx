// import React from "react";
// import { Link } from "react-router";

import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
        <Outlet />
      </div>
    </>
  );
};

export default AuthLayout;
