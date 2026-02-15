import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData} from "@/lib/cookie";

const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
    '/talent/login',
    '/recruiter/login',
    '/talent/forgot-password',
    '/recruiter/forgot-password',
    '/admin/login'
];
const adminRoutes = ['/admin'];
const userRoutes = ['/user'];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = await getAuthToken();
    const user = token ? await getUserData() : null;

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    const isUserRoute = userRoutes.some(route => pathname.startsWith(route));
    
    if(!token && !isPublicRoute){
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if(token && user){
        if(isAdminRoute && user.role !== 'admin'){
            return NextResponse.redirect(new URL('/', request.url));
        }
        if(isUserRoute && user.role !== 'user' && user.role !=='admin'){
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    if(isPublicRoute && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}
export const config = {
    matcher: [
        // what routes to protect/match
        '/admin/:path*',
        '/user/:path*',
        '/login',
        '/forgot-password',
        '/verify-otp',
        '/reset-password',
        '/talent/login',
        '/recruiter/login',
        '/talent/forgot-password',
        '/recruiter/forgot-password',
        '/admin/login',
        '/register'
    ]
}