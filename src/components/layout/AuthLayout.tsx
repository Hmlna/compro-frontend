import { Outlet } from "react-router";
import loginBg from "@/assets/loginBg.jpg";

const AuthLayout = () => {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={loginBg}
          alt="Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 mx-4 w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
