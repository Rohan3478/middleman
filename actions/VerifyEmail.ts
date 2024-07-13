"use server";
import prisma from "@/helpers/db";
import { revalidatePath } from "next/cache";

export const VerifyEmail = async ({ username, otp }: { username: string, otp: string }) => {
    try {
        const findUserExist = await prisma.user.findFirst({
            where: {
                username: username
            }
        });
        if (!findUserExist) {
            throw new Error("User not found");
        }

        if (findUserExist.verificationCode !== otp) {
            return { msg: "Invalid OTP" };
        }
        const verificationCode = Math.floor(1000 + Math.random() * 900000).toString();
        const res = await prisma.user.update({
            where: {
                id: findUserExist.id
            },
            data: {
                verified: true,
                verificationCode: verificationCode
            }
        })
        revalidatePath('/verify');
        return { msg: "Email Verified" };
    } catch (error) {
        console.log(error);
        return { msg: "User not found" };
    }
}