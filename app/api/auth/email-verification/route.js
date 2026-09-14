import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request){
try{
    const token = request.nextUrl.searchParams.get('token');
    if(!token) return NextResponse.json({message: 'Token not found'}, {status: 404})

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // const [rows] = await db.query(
    //     "SELECT * FROM users WHERE verification_token = ?",
    //     [token]
    // )

    const dbUser = await prisma.user.findUnique({
        where: {email: decoded.email, verificationToken: token}
    })

    if(!dbUser){
        return NextResponse.json({message: "Invalid token"},{status: 404})
    }

    // await db.query(
    //     "UPDATE users SET is_verified = ?, verification_token = ? WHERE id = ?",
    //     [true, null, user.id]
    // )

    const updatedUser = await prisma.user.update({
        where:{email: decoded.email},
        data: {isVerified: true, verificationToken: null}
    })

    const loginToken = jwt.sign(
        {userId: updatedUser.id, tokenVersion: updatedUser.tokenVersion},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    )

    const response = NextResponse.json({message: "Verification successfull"},{status: 200})

    response.cookies.set("token", loginToken,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
    })

    return response;

}catch(error){
    return NextResponse.json({message: "token expired"},{status: 400})
}
}