"use client";

import { authClient } from "../../lib/auth-client";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLoginFun = async (datum) => {
    const { email, password } = datum;

    try {
      const res = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
        callbackURL: "/",
      });

      console.log("LOGIN RESPONSE:", res);

      // 1. Check if better-auth returned an error inside the response object
      if (res?.error || res?.data?.error) {
        toast.error(res?.error?.message || "Invalid credentials matched.");
        return;
      }

      toast.success("Logged in successfully!");

      // 2. CRITICAL FIX: Forces the navbar state listeners to mount layout updates instantly
      window.location.replace("/");

    } catch (err) {
      console.error(err);
      toast.error(
        err?.message || "Invalid credentials or server error"
      );
    }
  };

  const signInGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      toast.error("Google Authentication failed");
    }
  };

  const signInGithub = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch (err) {
      toast.error("GitHub Authentication failed");
    }
  };

  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center bg-gray-200 py-10">
      <div className="bg-white w-full max-w-md p-8 rounded-md shadow">
        <h2 className="text-center text-2xl font-semibold mb-6">
          Login your account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit(handleLoginFun)}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full px-3 py-2 border rounded bg-gray-100 text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type={isShowPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full px-3 py-2 border rounded bg-gray-100 text-sm pr-12"
            />

            <span
              className="absolute right-3 bottom-2.5 text-xs cursor-pointer select-none text-gray-500 hover:text-gray-800"
              onClick={() => setIsShowPassword(!isShowPassword)}
            >
              {isShowPassword ? "Hide" : "Show"}
            </span>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2.5 rounded font-semibold hover:bg-gray-900 transition"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-5 text-gray-600">
          Don’t Have An Account?{" "}
          <Link href="/registation">
            <span className="text-amber-500 font-semibold hover:underline">
              Register
            </span>
          </Link>
        </p>

        {/* Social Login */}
        <div className="flex flex-col gap-2.5 mt-6 text-sm font-medium">
          <button
            type="button"
            onClick={signInGoogle}
            className="flex items-center justify-center gap-2 border py-2.5 rounded hover:bg-gray-50 transition shadow-sm text-gray-700"
          >
            <FaGoogle className="text-red-500" /> Google
          </button>

          <button
            type="button"
            onClick={signInGithub}
            className="flex items-center justify-center gap-2 border py-2.5 rounded hover:bg-gray-50 transition shadow-sm text-gray-700"
          >
            <FaGithub /> GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;