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
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Signup = () => {
    const [username, setUsername] = useState('');
  const form = useForm<schemaSignup>({
    resolver: SignupResolver,
    defaultValues: initialSignupValue,
  });

  const onSubmit = (data: schemaSignup) => {
    console.log(data)
  }
  return (
    <div>
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
                      setUsername(e.target.value);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
        </form>
     </Form>
    </div>
  );
};

export default Signup;
