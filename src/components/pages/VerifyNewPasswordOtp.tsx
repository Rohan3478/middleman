"use client";

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { VerifyEmail } from "../../../actions/VerifyEmail";
import { useState } from "react";
import ConfirmPassword from "./ConfirmPassword";

const verifySchema = z.object({
  code: z.string().min(6, "Verification code must be at least 6 characters"),
});

export default function VerifyPasswordOtp({username}: {username: string}) {
  const router = useRouter();
  const { toast } = useToast();
  const [goToConfirmPassword, setgoToConfirmPassword] = useState(false);
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  if(goToConfirmPassword){
    return <ConfirmPassword username={username}/>;
  }

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const res = await VerifyEmail({ username, otp: data.code });
      if(res.status == false){
        toast({
          title: "Failed",
          description: "Wrong OTP",
        });  
        return;
      }
      setgoToConfirmPassword(true);
    } catch (error) {
      console.log(error);
      router.push("/login");
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Toaster />

      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
