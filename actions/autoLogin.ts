"use server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@/helpers/db";
import { revalidatePath } from "next/cache";
async function GetAutoUserDetails() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("middleman")?.value as string;
        const secret = process.env.JWT_SECRET!;
        const verifyjwt = jwt.verify(token, secret);
        const UserId = (verifyjwt as JwtPayload).id;
        revalidatePath("/login");
        const res = await prisma.user.findFirst({
            where: {
                id: UserId
            }
        })
        if (!res) {
            return { msg: "Something went wrong , Login Manually or Try again later", status: false }
        }
        return { msg: "User LoggedIn", id: res.id, username: res.username, verified: res.verified, role: res.role, status: true }
    }

    catch (error) {
        return { msg: "Something went wrong , Login Manually or Try again later", status: false }
    }
}

export default GetAutoUserDetails