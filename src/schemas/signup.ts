import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z.object({
    id : z.string().optional(),
    email: z.string().email({
        message: 'Invalid email address'
    }),
    role: z.string(),
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
    verificationCode: z.string().optional(),
    youtubeApiKey: z.string().optional()
})

export const initialSignupValue = {
email: '',
username: '',
password: '',
secretWord: '',
role: '',
youtubeApiKey: ''
}

export const SignupResolver = zodResolver(signUpSchema);
export type schemaSignup = z.infer<typeof signUpSchema>;