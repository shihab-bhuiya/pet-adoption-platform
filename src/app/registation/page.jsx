"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

const RegisterPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegisterFun = async (datum) => {
  const { name, photoURL, password, email } = datum;

  try {
    await authClient.signUp.email({
      name,
      email,
      password,
      image: photoURL,
      callbackURL: "/",
    });

    toast.success("Account created & logged in!");

    // small delay so cookie/session is set properly
    setTimeout(() => {
      window.location.replace("/");
    }, 300);
  } catch (err) {
    console.error(err);
    toast.error(err?.message || "Registration failed");
  }
};

  return (
    <div className="container mx-auto min-h-screen p-10 flex items-center justify-center bg-gray-200">
      <div className="bg-white w-full max-w-md p-8 rounded-md shadow-md">
        <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">
          Register your account
        </h2>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(handleRegisterFun)}
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register("name", {
                required: "Name is required",
              })}
              className="w-full px-3 py-2 border rounded bg-gray-100 text-sm"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Photo URL
            </label>
            <input
              type="text"
              placeholder="Enter your photo URL"
              {...register("photoURL", {
                required: "Photo URL is required",
              })}
              className="w-full px-3 py-2 border rounded bg-gray-100 text-sm"
            />
            {errors.photoURL && (
              <p className="text-red-500 text-xs mt-1">
                {errors.photoURL.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
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
              className="absolute right-3 bottom-2.5 text-xs cursor-pointer"
              onClick={() =>
                setIsShowPassword(!isShowPassword)
              }
            >
              {isShowPassword ? "Hide" : "Show"}
            </span>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              {...register("terms", {
                required: "Accept terms required",
              })}
            />
            <label>Accept Terms & Conditions</label>
          </div>

          {errors.terms && (
            <p className="text-red-500 text-xs">
              {errors.terms.message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2.5 rounded"
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-5">
          Already have an account?{" "}
          <Link href="/login">
            <span className="text-blue-600 font-semibold">
              Sign In
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;