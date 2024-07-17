"use server";
import prisma from "@/helpers/db";
import Sendit from "@/helpers/SendIt";
import { revalidatePath } from "next/cache";

async function forgotpassword(data: any) {
    try {
        const { email } = data;
        revalidatePath("/login");
        const isEmailExist = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if (!isEmailExist) {
            return { msg: "Email not exist", status: false };
        }

        await Sendit({ to: isEmailExist.email, name: isEmailExist.username, subject: "Forgot Password", body: isEmailExist.verificationCode });

        return {username: isEmailExist.username ,msg: "OTP sent successfully", status: true};
    } catch (error) {
        revalidatePath("/login");
        return { msg: "Something went wrong", status: false };
    }
}

export default forgotpassword;