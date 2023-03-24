import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { auth200_t } from "@Login/index";

/*
    middleware allows to catch the request, manipulate w/ login before return.
    Docs for middleware: https://nextjs.org/docs/advanced-features/middleware

    Overview of middleware:

    1. Check if env values supplied in .env file 
        [y]: continue onwards 
        [n]: return error to client

    2. Check if user's request has a cookie under the name "pb_auth"
        [y]: continue onwards
        [n]: return with a redirect to login page
        
    3. Parse cookie and check if the token is expired or has been tampered with by asking the server
        General logic:
            Page    |   Cookies     |   Result
            ===============================================
            /*      |   Yes         |   allow to next page
            /*      |   No          |   redirect to login
            /login  |   Yes         |   redirect to /
            /login  |   No          |   allow to next page

        [valid token]: on the re-auth action a new token is given, set new cookie with token. If user wants to go to login page:
            [y]: redirect to home page as already logged in
            [n]: allow user to continue onwards
        [invalid token]: return with a redirect to login page and remove cookie
        [server down]: if fetch fails, goes into catch where returns an error response.
*/

export const middleware = async (req: NextRequest): Promise<NextResponse> => {
    return NextResponse.next();

    // =================================================
    // 1

    if (!process.env.PD_DB || !process.env.AUTH_REFRESH_URL) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: "environment variable for the database not found",
            }),
            { status: 401, headers: { "content-type": "application/json" } }
        );
    }

    // =================================================
    // 2

    const cookie = req.cookies.get("pb_auth");

    if (!cookie) {
        // if already on login page, let user go to login page
        if (req.nextUrl.pathname === "/login") {
            return NextResponse.next();
        } else {
            // if wanting to go to login page, redirect as need to login
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // =================================================
    // 3

    const pbAuth: auth200_t = JSON.parse(cookie.value);

    /* 
        Fetch in try catch block as a method for detecting if the database server (pocketbase)
        is offline or unable to respond. If the database server is down, return error to user. 
    */
    try {
        const tokenCheck: Response = await fetch(process.env.AUTH_REFRESH_URL, {
            method: "POST",
            headers: {
                Authorization: pbAuth.token,
            },
        });

        switch (tokenCheck.status) {
            /* 
                From pocketbase API, known ONLY 2 responses:
                    200: Success
                    400: Failed to authenticate
            */
            case 200:
                const resNext =
                    req.nextUrl.pathname === "/login"
                        ? NextResponse.redirect(new URL("/", req.url))
                        : NextResponse.next();

                resNext.cookies.set(
                    "pb_auth",
                    JSON.stringify(await tokenCheck.json())
                );

                return resNext;

            default:
                /*
                    If there was a cookie, but not valid token, then have re-login
                    and delete the invalid cookie. 
                */
                const resRedirect = NextResponse.redirect(
                    new URL("/login", req.url)
                );

                resRedirect.cookies.delete("pb_auth");

                return resRedirect;
        }
    } catch (err) {
        // if fetch failed, then pocketbase server offline
        return new NextResponse(
            JSON.stringify({
                success: false,
                message:
                    "Database server is offline, hence unable to authenticate user into site.",
            }),
            { status: 503, headers: { "content-type": "application/json" } }
        );
    }
};

/* 
    As we don't want to run the middleware on all routes, we give
    config to only run on pages. Accomplished through regex
    expression.

    Source: https://stackoverflow.com/a/74995197
*/
export const config = {
    matcher: "/((?!api|static|.*\\..*|_next).*)",
};
