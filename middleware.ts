import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(req:NextRequest){
    const {pathname} = req.nextUrl;
    if (
        pathname.startsWith("/api/auth") || 
        pathname.startsWith("/_next") ||
        pathname.includes(".") ||
        pathname.startsWith("/auth")
    ){
        return NextResponse.next();
    }
    if(pathname.startsWith("/dashboard") || pathname.startsWith("/api")){
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token){
            const loginUrl = new URL("/auth",req.url);
            loginUrl.searchParams.set("callbackUrl",pathname);
            return NextResponse.redirect(loginUrl);
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher :["/dashboard/:path*","/api/:path*"]
}