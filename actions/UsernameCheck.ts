"use server";
import { revalidatePath } from "next/cache";
import prisma from "../src/helpers/db"
export const checkUserNameValid = async (username: string) => {
   try {
    const res = await prisma.user.findFirst({
        where: {
            username: username
        }
    })

    revalidatePath("/signup");
    return {msg: res ? "Username already exists" : "Username Available"}
   }
   catch(error){
    console.log(error)
    throw error;
   }
}