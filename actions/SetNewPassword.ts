"use server";
import prisma from "@/helpers/db";
import bcryptjs from "bcryptjs";
import { revalidatePath } from "next/cache";
async function SetNewPassword(info: any){
    try {
        revalidatePath("/login");
        const {username, password} = info;
        const isUserExist = await prisma.user.findFirst({
            where: {
                username: username
            }
        });

        if(!isUserExist){
            return {msg: "User not found", status: false};
        }

        const salt = await bcryptjs.genSalt(10);
        info.password = await bcryptjs.hash(info.password, salt);
        const hey = info.password;
    
        const res = await prisma.user.update({
            where: {
                id: isUserExist.id
            },
            data: {
                password: hey
            }
        })

        return {msg: "Password updated successfully", status: true}
    } catch (error) {
        revalidatePath("/login");
        return {msg: "Something went wrong", status: false}
    }
}

export default SetNewPassword