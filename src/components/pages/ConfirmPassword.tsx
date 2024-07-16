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
import SetNewPassword from "../../../actions/SetNewPassword";

const newPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  ConfirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

export default function ConfirmPassword({ username }: { username: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
  });

  const onSubmit = async (data: z.infer<typeof newPasswordSchema>) => {
    if (data.password !== data.ConfirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "The fields of both Password is different",
      });
      return;
    }
    try {
      const res = await SetNewPassword(data);
      if (res.status == false) {
        toast({
          title: "Failed",
          description: "Something went wrong, Try agian",
        });
        return;
      }
      router.push('/');
      toast({
              title: "Success",
              description: "Password Updated Successfully",
            });
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
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="ConfirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
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
