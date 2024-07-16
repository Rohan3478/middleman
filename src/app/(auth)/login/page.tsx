"use client";
import { useForm } from "react-hook-form";
import { getCookie } from 'cookies-next';
import {
  LoginResolver,
  LoginSchema,
  initialLoginValues,
} from "@/schemas/login";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoginAccount from "../../../../actions/LoginAccount";
import ForgotPassword from "@/components/pages/ForgotPassword";

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [goToForgotPassword, setgoToForgotPassword] = useState(false);
  getCookie('middleware');
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<LoginSchema>({
    resolver: LoginResolver,
    defaultValues: initialLoginValues,
  });

  if(goToForgotPassword){
    return <ForgotPassword/>
  }

  const onSubmit = async (data: LoginSchema) => {
    try {
      setIsSubmitting(true);
      console.log("In onsubmit");
      const res = await LoginAccount(data);
      if (res.status === false) {
        toast({
          title: "Error",
          description: res.msg,
        });
        return;
      }
      router.push("/");
      toast({
        title: "Success",
        description: res.msg,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong, Try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Toaster />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input
                  {...field}
                  type={showDetails === false ? "password" : "text"}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-blue-500 hover:cursor-pointer" onClick={()=>setgoToForgotPassword(true)}>Forgot Password</div>

          <FormField
            name="secretWord"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secret</FormLabel>
                <Input
                  {...field}
                  type={showDetails === false ? "password" : "text"}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          {showDetails ? (
            <div
              className="flex gap-x-3 items-center"
              onClick={() => setShowDetails(!showDetails)}
            >
              <FaEyeSlash /> Hide Details
            </div>
          ) : (
            <div
              className="flex gap-x-3 items-center"
              onClick={() => setShowDetails(!showDetails)}
            >
              <IoEyeSharp /> Show Details
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
        <Link href="/signup" className="text-blue-500">
          Does not have an account?
        </Link>
      </Form>
    </div>
  );
};

export default Login;
