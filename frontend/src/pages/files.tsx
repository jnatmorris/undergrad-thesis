import { NextPage } from "next";
import React, { forwardRef, useRef } from "react";
import { AuthContext } from "@Login/index";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import { useSocket } from "@Socket/index";

const Files: NextPage = () => {
    const [openAddModal, setAddModal] = React.useState<boolean | null>(null);
    const [openViewModal, setViewModal] = React.useState<boolean | null>(null);
    const fileRef = React.useRef<HTMLInputElement | null>(null);

    // custom hook to hold socket info client side
    const { startSending, state, dispatch } = useSocket({
        debug: true,
    });

    const handleFileSave = (files: FileList | null): void => {
        if (!files || !files[0]) return;

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (!e.target) return;

            const length = e.target.result
                ?.toString()
                .split(/\n(?=\d+\n)/).length;

            if (!length) return;

            dispatch({
                type: "setFile",
                payload: { file: files[0], numMolecule: length },
            });
        };

        reader.readAsText(files[0]);
    };

    React.useEffect(() => {
        // make client side state reflect url on initial load
        setAddModal(window.location.hash === "#input" ? true : false);
        setViewModal(window.location.hash === "#fileReview" ? true : false);

        // when hash changed, set modal open or closed
        const onHashChanged = (): void => {
            setAddModal(window.location.hash === "#input" ? true : false);
            setViewModal(window.location.hash === "#fileReview" ? true : false);

            if (fileRef.current) fileRef.current.value = "";
        };

        // subscribe to event
        window.addEventListener("hashchange", onHashChanged);

        // unsubscribe from event
        return () => {
            window.removeEventListener("hashchange", onHashChanged);
        };
    }, []);

    return (
        <>
            <Head>
                {(openAddModal === true || openAddModal === false) && (
                    <title>
                        {openAddModal
                            ? "Molecular ML: File Upload"
                            : "Molecular ML: File Viewer"}
                    </title>
                )}
            </Head>
            <div className="relative">
                <a href="#input" target="_self">
                    Upload File
                </a>
                <div
                    id="input"
                    className="group invisible absolute top-0 h-full w-full bg-white opacity-0 transition-all duration-200 target:visible target:opacity-100"
                >
                    {/* tag to close modal when clicked outside */}
                    <a href="#" className="fixed left-0 h-full w-full" />
                    <div className="mt-[10vh]">
                        <div className="scale-0 space-y-5 rounded bg-white/80 pt-1 shadow-md ring-1 ring-slate-200 transition-all duration-300 group-target:scale-100">
                            <div className="space-y-4 px-2">
                                <h1 className="text-xl font-semibold text-slate-700">
                                    Upload xyz files
                                </h1>
                                <div className="space-y-1">
                                    <label htmlFor="fileInput">xyz file</label>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        // accept=".xyz"
                                        className="block w-5/6 file:rounded-lg file:border-0 file:bg-blue-200 file:text-slate-600 file:ring-0"
                                        ref={fileRef}
                                        onChange={(e) =>
                                            handleFileSave(e.target.files)
                                        }
                                    />
                                </div>

                                {state.currentlySending && state.file && (
                                    <div>
                                        <div className="grid grid-cols-3">
                                            <div className="col-span-2 flex justify-start space-x-4">
                                                <p className="">
                                                    {state.isConnected
                                                        ? "connected"
                                                        : "disconnected"}
                                                </p>
                                                <div className="h-3 w-3 animate-pulse rounded-full bg-green-600" />
                                            </div>
                                            <p className="justify-end">
                                                {state.progress.length} /{" "}
                                                {state.numMolecules}
                                            </p>
                                        </div>
                                        <div className="max-h-[32vh] space-y-3 overflow-y-scroll">
                                            {Array(state.numMolecules).map(
                                                (val, index) => {
                                                    var status: "C" | "P" | "W";

                                                    const { progress } = state;

                                                    if (
                                                        progress.includes(index)
                                                    ) {
                                                        status = "C";
                                                    } else {
                                                        status = "W";
                                                    }

                                                    const render = (
                                                        val: "C" | "P" | "W"
                                                    ): React.ReactNode => {
                                                        switch (val) {
                                                            case "C":
                                                                return (
                                                                    <div className="grid grid-cols-2 items-center">
                                                                        <p className="items-center text-center">
                                                                            {
                                                                                index
                                                                            }
                                                                        </p>
                                                                        <div className="justify-end rounded-lg bg-green-500/50 py-0.5">
                                                                            <p className="text-center text-white">
                                                                                Completed
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                );

                                                            case "P":
                                                                return (
                                                                    <div className="grid grid-cols-2 items-center">
                                                                        <p className="text-center">
                                                                            {
                                                                                index
                                                                            }
                                                                        </p>

                                                                        <div className="rounded-lg bg-orange-500/60 py-0.5">
                                                                            <p className="text-center text-white">
                                                                                Processing
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                );

                                                            case "W":
                                                                return (
                                                                    <div className="grid grid-cols-2 items-center">
                                                                        <p className="text-center">
                                                                            {
                                                                                index
                                                                            }
                                                                        </p>
                                                                        <div className="rounded-lg bg-red-500/60 py-0.5">
                                                                            <p className="text-center text-white">
                                                                                Waiting
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                );
                                                        }
                                                    };

                                                    return (
                                                        <div key={index}>
                                                            {render(status)}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end space-x-4 bg-slate-100 py-2 pr-2">
                                <a
                                    className="flex scale-100 items-center rounded-lg border bg-red-300 px-1.5 py-0.5 font-medium text-slate-700 no-underline shadow-sm transition-all duration-200 active:scale-95"
                                    href="#"
                                >
                                    Cancel
                                </a>
                                <button
                                    className="rounded-lg border border-slate-400 bg-white px-1.5 py-0.5 font-medium text-slate-600 no-underline shadow-sm"
                                    onClick={startSending}
                                >
                                    Upload & Compute
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    id="fileReview"
                    className="group invisible absolute top-0 mt-[10vh] h-full w-full bg-white opacity-0 transition-all duration-200 target:visible target:opacity-100"
                >
                    {/* click outside of modal, then back to main page */}
                    <a href="#" className="fixed left-0 h-full w-full" />
                    <div className="rounded-lg px-2 pt-1 shadow-md ring-1 ring-slate-200">
                        <h1 className="text-xl font-semibold text-slate-700">
                            File Viewer
                        </h1>

                        <div></div>
                        {/* <p>{data?.items[selected].parameters}</p> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Files;
