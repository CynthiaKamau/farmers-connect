"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { register } from "@/lib/auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phoneNumber: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  farmName: z.string().min(1, "Farm name is required"),
  farmLocation: z.string().min(1, "Farm location is required"),
  farmSize: z.string().min(1, "Farm size is required"),
  cropsPlanted: z.string().min(1, "Please enter at least one crop"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setApiError("");

    try {
      const crops = data.cropsPlanted
        .split(",")
        .map((crop) => crop.trim())
        .filter((crop) => crop);

      await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber || "",
        password: data.password,
        farmName: data.farmName,
        farmLocation: data.farmLocation,
        farmSize: data.farmSize,
        cropsPlanted: crops,
      });

      router.push("/signin?registered=true");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Registration failed");
    }
  };
  
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                    fill="#EB4335"
                  />
                </svg>
                Sign up with Google
              </button>
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg
                  width="21"
                  className="fill-current"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z" />
                </svg>
                Sign up with X
              </button>
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                {apiError && (
                  <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
                    {apiError}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="firstName"
                      placeholder="Enter your first name"
                      {...registerField("firstName")}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lastName"
                      placeholder="Enter your last name"
                      {...registerField("lastName")}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    {...registerField("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                {/* <!-- Phone Number --> */}
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                    {...registerField("phoneNumber")}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      {...registerField("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* <!-- Farm Information --> */}
                <div className="border-t pt-5 mt-5">
                  <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-4">
                    Farm Information
                  </h3>

                  {/* <!-- Farm Name --> */}
                  <div className="mb-5">
                    <Label>
                      Farm Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="farmName"
                      placeholder="Enter your farm name"
                      {...registerField("farmName")}
                    />
                    {errors.farmName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.farmName.message}
                      </p>
                    )}
                  </div>

                  {/* <!-- Farm Location --> */}
                  <div className="mb-5">
                    <Label>
                      Farm Location<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="farmLocation"
                      placeholder="Enter your farm location"
                      {...registerField("farmLocation")}
                    />
                    {errors.farmLocation && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.farmLocation.message}
                      </p>
                    )}
                  </div>

                  {/* <!-- Farm Size --> */}
                  <div className="mb-5">
                    <Label>
                      Farm Size<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="farmSize"
                      placeholder="e.g., 10 acres"
                      {...registerField("farmSize")}
                    />
                    {errors.farmSize && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.farmSize.message}
                      </p>
                    )}
                  </div>

                  {/* <!-- Crops Planted --> */}
                  <div>
                    <Label>
                      Crops Planted<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="cropsPlanted"
                      placeholder="e.g., Corn, Beans, Wheat (comma-separated)"
                      {...registerField("cropsPlanted")}
                    />
                    {errors.cropsPlanted && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.cropsPlanted.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* <!-- Checkbox --> */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    className="w-5 h-5 mt-1 rounded border-gray-300"
                    {...registerField("termsAccepted")}
                  />
                  <label htmlFor="termsAccepted" className="font-normal text-gray-500 dark:text-gray-400 text-sm">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </label>
                </div>
                {errors.termsAccepted && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.termsAccepted.message}
                  </p>
                )}
                {/* <!-- Button --> */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creating Account..." : "Sign Up"}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
