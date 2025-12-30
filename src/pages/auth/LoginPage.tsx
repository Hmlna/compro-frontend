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
      <div className="flex flex-col space-y-2 text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Login to your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password below
        </p>
      </div>

      {showLogoutMsg && (
        <div className="mb-6 rounded-md bg-red-50 p-3 text-red-800 text-sm border border-red-200 text-center">
          You’ve been logged out.
        </div>
      )}

      <Form {...form}>
        <form onSubmit={onSubmit} className="grid gap-4">
          <FormField
            control={control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      {...field}
                    />
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                  </div>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <Button type="submit" disabled={isLoading} className="w-full mt-2">
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-blue-600 hover:text-blue-500"
        >
          Sign up
        </Link>
      </div>
    </>
  );
};

export default LoginPage;
