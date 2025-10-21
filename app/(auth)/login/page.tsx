"use client";

import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/public/assets/rajput-logo1.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
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

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const formSchema = LoginSchema.pick({
    email: true,
  }).extend({
    password: z.string().min(4, "Password field is required"),
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
  };

  return (
    <Card className="w-[450px]">
      <CardContent>
        <div className="flex justify-center">
          <Image
            src={Logo.src}
            width={Logo.width}
            height={Logo.height}
            alt="rgs"
            className="max-w-[130px]"
          />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold">Login Into Account</h1>
          <p>Login into your account by filling out the form below.</p>
        </div>
        <div className="mt-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLoginSubmit)}
              className="space-y-8"
            >
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? "password" : "text"}
                          placeholder="**********"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <FaRegEyeSlash size={18} />
                        ) : (
                          <FaRegEye size={18} />
                        )}
                      </button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <ButtonLoading
                  type="submit"
                  text="Login"
                  loading={loading}
                  className="w-full"
                />
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default Login;
