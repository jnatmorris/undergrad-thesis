import { NextRequest, NextResponse } from "next/server";

export const middleware = (req: NextRequest) => {
    // if the pathname is index, allow
    if (req.nextUrl.pathname === "/") return NextResponse.next();

    // else if the path is something else redirect to index
    return NextResponse.redirect(new URL("/", req.url));
};

// https://github.com/vercel/next.js/discussions/36308#discussioncomment-3758041
export const config = {
    matcher: "/((?!api|static|.*\\..*|_next).*)",
};
