"use server";
import bcryptjs from "bcryptjs";
import prisma from "@/helpers/db";
import { LoginSchema } from "@/schemas/login";
import { revalidatePath } from "next/cache";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers'
async function LoginAccount(data: LoginSchema) {
    const { username, secretWord, password } = data;
    try {

        revalidatePath("/login");
        const res = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

        if (!res) {
            return { msg: "User not found", status: false };
        }
        const comparePassword = await bcryptjs.compare(password, res.password);
        if (!comparePassword || secretWord != res.secretWord) {
            return { msg: "Invalid Credentials", status: false }
        }

        const jwtSecret = process.env.JWT_SECRET as string;
        const token = jwt.sign({ id: res.id, username: res.username }, jwtSecret, { expiresIn: "1d" });

        const cookieStore = cookies()
        const theme = cookieStore.set('middleman', token, {
            maxAge: 60 * 60 * 24,
            httpOnly: true,
        });

        return {
            msg: "Used Logged Successfully",
            status: true
        }
    } catch (error) {
        revalidatePath("/login");
        return { msg: "Something went wrong", status: 401 };

    }
}

export default LoginAccount;