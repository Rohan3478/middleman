import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const Login = z.object({
    username: z.string().min(3, {
        message: 'Username must be at least 3 characters long'
    }).max(20, {
        message: 'Username is maximum 20 characters long'
    }).regex(/^[a-zA-Z0-9_]*$/, "Username must contain only letters, numbers and underscores"),
    password: z.string().min(6, {
        message: 'Password must be at least 6 characters long'
    }),
    secretWord: z.string().min(6, {
        message: 'Secret word must be at least 6 characters long'
    }),
})

export const initialLoginValues = {
    username: "",
    password: "",
    secretWord: ""
}

export const LoginResolver = zodResolver(Login);
export type LoginSchema = z.infer<typeof Login>;