import { NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(request){
try{

    const token = request.nextUrl.searchParams.get('token');
    if(!token) return NextResponse.json({message: 'Token not found'}, {status: 404})

    jwt.verify(token, process.env.JWT_SECRET)

    const [rows] = await db.query(
        "SELECT * FROM users WHERE verification_token = ?",
        [token]
    )

    if(rows.length === 0){
        return NextResponse.json({message: "Invalid token"},{status: 404})
    }

    const user = rows[0]

    db.query(
        "UPDATE users SET is_verified = ?, verification_token = ? WHERE id = ?",
        [true, null, user.id]
    )

    const jwtToken = jwt.sign(
        {name: user.name, email: user.email, is_verified: true},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    )

    const response = NextResponse.json({message: "Verification successfull"},{status: 200})

    response.cookies.set("token", jwtToken,{
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