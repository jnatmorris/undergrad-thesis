import Head from "next/head";
import React from "react";
import { Header } from "@Header/index";
import { useAuth, AuthContext } from "@Login/index";
import { Toaster } from "react-hot-toast";

interface props {
    children: React.ReactNode;
}

export const Layout: React.FC<props> = ({ children }) => {
    const { authStorage, startSession, endSession } = useAuth();

    const [headerModalOpen, setHeaderModalOpen] =
        React.useState<boolean>(false);

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>Molecular ML</title>
            </Head>

            <Toaster position="bottom-right" />
            <main className="prose prose-h1:m-0 prose-p:m-0">
                <div className="w-screen">
                    <div className="mx-[10vw] lg:mx-[16vw]">
                        <AuthContext.Provider
                            value={{
                                authStorage,
                                startSession,
                                endSession,
                            }}
                        >
                            <Header
                                setHeaderModalOpen={setHeaderModalOpen}
                                headerModalOpen={headerModalOpen}
                            />
                            {!headerModalOpen && <div>{children}</div>}
                        </AuthContext.Provider>
                    </div>
                </div>
            </main>
        </>
    );
};
