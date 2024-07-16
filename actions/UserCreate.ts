"use server";
import prisma from "@/helpers/db";
import { revalidatePath } from "next/cache";
import bcryptjs from "bcryptjs";
import Sendit from "@/helpers/SendIt";
export const CreateAccount = async (data: any) => {
  try {
    const salt = await bcryptjs.genSalt(10);
    data.password = await bcryptjs.hash(data.password, salt);
    if (data.role == 'User') {
      data.youtubeApiKey = "";
    }
    await prisma.user.create({
      data: {
        ...data,
      },
    });
    revalidatePath("/signup");
    await Sendit({ to: data.email, name: data.username, subject: "Verify Email Address", body: data.verificationCode });
    return { msg: "Account created successfully" };
  } catch (err) {
    revalidatePath("/signup");
    console.error(err);
    throw err;
  }
}