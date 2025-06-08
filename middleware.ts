import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(req:NextRequest){
    const {pathname} = req.nextUrl;
    if (
        pathname.startsWith("/api") || 
        pathname.startsWith("/_next") ||
        pathname.includes(".")
    ){
        return NextResponse.next();
    }
    if(pathname.startsWith("/dashboard")){
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token){
            const loginUrl = new URL("/",req.url);
            loginUrl.searchParams.set("callbackUrl",pathname);
            return NextResponse.redirect(loginUrl);
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher :["/dashboard/:path*"]
}