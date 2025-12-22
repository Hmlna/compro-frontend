/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

const loginFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [params] = useSearchParams();
  const loggedOut = params.get("logged_out") === "1";
  const [showLogoutMsg, setShowLogoutMsg] = useState(loggedOut);

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control } = form;

  useEffect(() => {
    if (!loggedOut) return;

    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete("logged_out");
    window.history.replaceState({}, "", cleanUrl.toString());

    const t = setTimeout(() => setShowLogoutMsg(false), 3000);

    return () => clearTimeout(t);
  }, [loggedOut]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await login(values.email, values.password);

      toast.success(`Welcome, ${result.user.name}!`);

      if (result.user.role === "USER") {
        navigate("/requests");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error("Wrong email or password");
      console.error(err);
    }
  });

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {showLogoutMsg && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-red-800 text-sm border border-red-200">
            You’ve been logged out.
          </div>
        )}

        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <FormField
              control={control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-700 hover:text-blue-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
};

export default LoginPage;
