"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ButtonLoading } from "@/components/shared/ButtonLoading";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Logo from "@/public/assets/rajput-logo1.png";
import { USER_LOGIN } from "@/routes/user.route";
import { RegisterSchema } from "@/lib/validation";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const formSchema = RegisterSchema.pick({
    fullname: true,
    email: true,
    password: true,
  })
    .extend({
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password and confirm password do not match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegisterSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Submitted Values:", values);
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#003366] via-[#007b5f] to-[#f5b700] flex-col justify-center items-center text-white relative">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center">
          <Image
            src={Logo}
            alt="RGS Logo"
            width={180}
            height={180}
            className="mx-auto mb-4"
          />
        </div>
        <div className="absolute bottom-5 text-sm text-gray-200">
          © {new Date().getFullYear()} Rajput Gensets and Solar — All rights
          reserved
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-[#f8fafc]">
        <Card className="w-full h-[620px] max-w-md shadow-2xl border-none rounded-2xl bg-white">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-[#003366] mb-1">
                Create Account
              </h2>
              <p className="text-gray-500 text-sm">
                Register to your{" "}
                <span className="text-[#007b5f] font-semibold">RGS</span>{" "}
                account
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleRegisterSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Sandeep Patel"
                          className="bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#007b5f] focus:border-[#007b5f] transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@gmail.com"
                          className="bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#007b5f] focus:border-[#007b5f] transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? "password" : "text"}
                          placeholder="Enter your password"
                          className="bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#007b5f] focus:border-[#007b5f] transition-all pr-10"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-8 right-3 text-gray-500 hover:text-[#007b5f]"
                      >
                        {showPassword ? (
                          <FaRegEyeSlash size={18} />
                        ) : (
                          <FaRegEye size={18} />
                        )}
                      </button>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-gray-700">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? "password" : "text"}
                          placeholder="Confirm your password"
                          className="bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#007b5f] focus:border-[#007b5f] transition-all pr-10"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute top-8 right-3 text-gray-500 hover:text-[#007b5f]"
                      >
                        {showConfirmPassword ? (
                          <FaRegEyeSlash size={18} />
                        ) : (
                          <FaRegEye size={18} />
                        )}
                      </button>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <ButtonLoading
                  type="submit"
                  text="Register"
                  loading={loading}
                  className="w-full bg-[#f5b700] hover:bg-[#e5a500] text-[#003366] font-semibold py-2 rounded-lg shadow-md transition-all"
                />

                <div className="text-center text-sm mt-6 space-y-2">
                  <div>
                    <p className="text-gray-600">
                      Already have an account?{" "}
                      <Link
                        href={USER_LOGIN}
                        className="text-[#007b5f] font-semibold hover:underline"
                      >
                        Login
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
