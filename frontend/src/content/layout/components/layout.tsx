import React from "react";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

interface props {
    children: React.ReactNode;
}

export const Layout: React.FC<props> = ({ children }) => {
    return (
        <>
            {/* inject into head of html */}
            <Head>
                <title>ML Training Data Generator</title>
                <meta charSet="UTF-8" />
                <meta
                    name="keywords"
                    content="NextJS, TailwindCSS, SocketIO, ThreeJS"
                />
                <meta
                    name="description"
                    content="This page apart of an undergrad thesis titled aimed at making a SAAS service generation of training data in trajectory-based molecular machine learning. The code can be found here: https://github.com/jnatmorris/undergrad-thesis"
                />
                <meta name="author" content="Justin Morris" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <link rel="icon" type="image/x-icon" href="./favicon.ico" />
            </Head>

            {/* allows to use react-hot-toast */}
            <Toaster position="bottom-right" />

            {/* define global typography styling */}
            <main className="prose prose-h1:m-0 prose-h4:m-0 prose-p:m-0">
                <div className="w-screen">
                    <div className="mx-[20vw]">
                        {/* place header of the website above pages */}
                        <header className="mb-[10vh] grid grid-cols-2 items-end pt-8">
                            <h1 className="z-20 self-end justify-self-start text-3xl font-semibold text-slate-700">
                                ML Training Data Generator
                            </h1>
                        </header>

                        {/* render children (pages) */}
                        {children}
                    </div>
                </div>
            </main>
        </>
    );
};
