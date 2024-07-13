"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  SignupResolver,
  schemaSignup,
  initialSignupValue,
} from "@/schemas/signup";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDebounceCallback } from "usehooks-ts";
import { checkUserNameValid } from "../../../../actions/UsernameCheck";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { CreateAccount } from "../../../../actions/UserCreate";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUserName, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounceCallback(setUsername, 600);
 
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<schemaSignup>({
    resolver: SignupResolver,
    defaultValues: initialSignupValue,
  });

  const onSubmit = async (data: schemaSignup) => {
    try {
      setIsSubmitting(true);
      if (data.role == "Admin" && !data.youtubeApiKey) {
        toast({
          title: "Required Api Key",
          description: "Youtube Api Key is required for Admin",
        });
        setIsSubmitting(false);
        return;
      }
      const  verificationCode = Math.floor(1000 + Math.random() * 900000).toString();
      data.verificationCode = verificationCode;
      const res = await CreateAccount(data);
      router.push(`/verify/${data.username}`)
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

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await checkUserNameValid(username);
          setUsernameMessage(response.msg);
        } catch (error: any) {
          setUsernameMessage(error.msg ?? "Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

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
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    debouncedUsername(e.target.value);
                  }}
                />
                {isCheckingUserName && <Loader2 className="animate-spin" />}
                <p
                  className={`text-sm ${
                    usernameMessage === "Username Available"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {usernameMessage}
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your Role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>
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
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="secretWord"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secret</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="youtubeApiKey"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Youtube Api Key</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Signup;
