"use client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import forgotpassword from "../../../actions/forgotpassword";
import { useState } from "react";
import VerifyPasswordOtp from "./VerifyNewPasswordOtp";

const verifyEmail = z.object({
  email: z.string().email(),
});

export default function ForgotPassword() {
  const router = useRouter();
  const { toast } = useToast();
  const [goToNewPasswordOtp, setgoToNewPasswordOtp] = useState(false);
  const [myusername, setmyusername] = useState("");
  const form = useForm<z.infer<typeof verifyEmail>>({
    resolver: zodResolver(verifyEmail),
  });

  if(goToNewPasswordOtp){
    return <VerifyPasswordOtp username={myusername}/>
  }

  const onSubmit = async (data: z.infer<typeof verifyEmail>) => {
    try {
      const res:any = await forgotpassword(data);
      if (res.status === false) {
        toast({
          title: "Failed",
          description: res.msg,
        });
        return;
      }
      setmyusername(res.username);
      setgoToNewPasswordOtp(true);
    } catch (error) {
      console.log(error);
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
            Email Confirmation
          </h1>
          <p className="mb-4">
            Enter your email you have setup account previously
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your email</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Next</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
