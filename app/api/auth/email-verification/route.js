import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request){
try{
    const token = request.nextUrl.searchParams.get('token');
    if(!token) return NextResponse.json({message: 'Token not found'}, {status: 404})

    const tokenVerify = await prisma.verificationToken.findUnique({
        where: {token}
    })

    if(!tokenVerify || tokenVerify.expires < new Date()){
        return NextResponse.json({message: "Token not found or Invalid!"},{status: 404})
    }

    const updatedUser = await prisma.user.update({
        where:{email: tokenVerify.identifier},
        data: {emailVerified: new Date()}
    })

    await prisma.verificationToken.delete({
        where:{
            identifier_token:{
                identifier: tokenVerify.identifier,
                token
            }
        }
    })

    return NextResponse.json({message: "Verification successfull"},{status: 200})

}catch(error){
    console.error(error)
    return NextResponse.json({message: "token expired"},{status: 500})
}
}