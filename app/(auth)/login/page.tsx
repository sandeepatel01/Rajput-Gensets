"use client";

import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import Image from "next/image";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ButtonLoading } from "@/components/shared/ButtonLoading";
import Link from "next/link";
import Logo from "@/public/assets/rajput-logo1.png";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const formSchema = LoginSchema.pick({
    email: true,
  }).extend({
    password: z.string().min(4, "Password is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Submitted Values: ", values);
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#003366] via-[#007b5f] to-[#f5b700] flex-col justify-center items-center text-white p-10 relative overflow-hidden">
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

      <div className="flex-1 flex items-center justify-center bg-[#f8fafc] p-6">
        <Card className="w-full max-w-md shadow-2xl border-none rounded-2xl bg-white">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-[#003366] mb-1">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-sm">
                Login to your{" "}
                <span className="text-[#007b5f] font-semibold">RGS</span>{" "}
                account
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleLoginSubmit)}
                className="space-y-6"
              >
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
                          placeholder="**********"
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

                <ButtonLoading
                  type="submit"
                  text="Login"
                  loading={loading}
                  className="w-full bg-[#f5b700] hover:bg-[#e5a500] text-[#003366] font-semibold py-2 rounded-lg shadow-md transition-all"
                />

                <div className="text-center text-sm mt-6 space-y-2">
                  <div>
                    <p className="text-gray-600">
                      Don&apos;t have an account?{" "}
                      <Link
                        href="/register"
                        className="text-[#007b5f] font-semibold hover:underline"
                      >
                        Create Account
                      </Link>
                    </p>
                  </div>
                  <div>
                    <Link
                      href="/forgot-password"
                      className="text-[#007b5f] hover:underline font-semibold"
                    >
                      Forgot Password?
                    </Link>
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

export default Login;
