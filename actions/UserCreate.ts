"use server";
import prisma from "@/helpers/db";
import { revalidatePath } from "next/cache";
import bcryptjs from "bcryptjs";
export const CreateAccount = async (data: any) => {
    try {
        const salt = await bcryptjs.genSalt(10);
        data.password = await bcryptjs.hash(data.password, salt);
        await prisma.user.create({
          data: {
            ...data,
          },
        });
        revalidatePath("/signup");
        return {msg: "Account created successfully"};
      } catch (err) {     
        console.error(err);
        throw err;
      }
}