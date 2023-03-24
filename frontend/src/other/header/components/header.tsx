import React from "react";
import { AuthContext } from "@Login/index";
import {
    XMarkIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import Link from "next/link";

interface props {
    setHeaderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    headerModalOpen: boolean;
}

export const Header: React.FC<props> = ({
    setHeaderModalOpen,
    headerModalOpen,
}) => {
    const { endSession } = React.useContext(AuthContext);
    const router = useRouter();
    const menuHandler = () => setHeaderModalOpen((prev) => !prev);

    React.useEffect(() => {
        router.events.on("routeChangeStart", () => {
            // remove modal from screen
            window.location.hash = "#";
            // close modal
            setHeaderModalOpen(false);
        });

        // unsubscribe from event
        return router.events.off("routeChangeStart", () => null);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    return (
        <header className="grid grid-cols-2 items-end pt-8">
            <h1 className="z-20 self-end justify-self-start text-3xl font-semibold">
                Name
            </h1>
            <a
                className="z-20 self-center justify-self-end lg:hidden"
                href={headerModalOpen ? "#nav" : "#"}
                target="_self"
            >
                {headerModalOpen ? (
                    <XMarkIcon className="h-6 w-6" onClick={menuHandler} />
                ) : (
                    <Bars3Icon className="h-6 w-6" onClick={menuHandler} />
                )}
            </a>

            <div
                id="nav"
                className="invisible absolute top-0 left-[10vw] right-[10vw] z-10 grid gap-y-12 bg-white pt-36 opacity-0 transition-all duration-300 ease-in-out target:visible target:grid-cols-1 target:opacity-100"
            >
                <div>
                    <Link
                        href="/"
                        className="text-lg font-normal text-slate-800 decoration-blue-600 decoration-[1.5px] underline-offset-2"
                    >
                        Home
                    </Link>

                    <p className="block pt-0.5 text-sm font-normal text-slate-500 lg:hidden">
                        Home page of
                    </p>
                </div>
                <div>
                    <Link
                        href={"/files"}
                        className="text-lg font-normal decoration-blue-600 decoration-[1.5px] underline-offset-2"
                    >
                        File Viewer
                    </Link>
                    <p className="block pt-0.5 text-sm text-slate-500 lg:hidden">
                        View and sort all{" "}
                        <span className="font-semibold">.xyz</span> files by
                        their number of molecules, excited states, date of
                        upload, and size.
                    </p>
                </div>

                <button
                    className="flex w-fit items-center space-x-10 text-lg font-normal text-slate-800"
                    onClick={endSession}
                >
                    Logout
                    <span className="inline pl-2 lg:hidden">
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    </span>
                </button>
            </div>
        </header>
    );
};
