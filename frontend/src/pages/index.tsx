import { NextPage } from "next";
import React from "react";
import {
    ArrowPathIcon,
    ArrowUturnLeftIcon,
    ArrowsPointingOutIcon,
} from "@heroicons/react/24/solid";
import classnames from "classnames";
import { useSocket, useSocketStore } from "../content/socket";
import { Modal_c } from "../content/modal";
import { CompletedView } from "../content/viewCompleted";
import { useUserInputStore } from "../content/modal/upload";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";

const Files: NextPage = () => {
    // get access to values and functions within in the stores
    const { isWaitingOnDisk, isSocketConnected, serverState } =
        useSocketStore();
    const { resetInputStore } = useUserInputStore();

    // custom hook to hold socket info client side
    const { startSending, refreshHandler, requestFile } = useSocket();

    // local state to determine what to see in the file explorer
    const [path, setPath] = React.useState<string[]>(["/"]);
    // function handler to reset the path to root
    const backHandler = () => setPath(["/"]);

    // determine the classnames based on values
    const refreshClasses = classnames("h-6", "w-6", "transition-all", {
        "animate-spin": isWaitingOnDisk,
    });
    const statusClasses = classnames("font-normal", {
        "text-green-500": isSocketConnected,
        "text-red-400": !isSocketConnected,
    });

    // the reason we don't remove user out of modal, but only change look is that a user's connection may not be stable
    const styleUpload = classnames(
        "flex",
        "h-fit",
        "w-fit",
        "items-center",
        "space-x-2",
        "justify-self-start",
        "rounded-lg",
        "bg-blue-400",
        "px-2",
        "py-1",
        "text-white",
        "no-underline",
        "shadow-md",
        "transition-all",
        "hover:shadow-lg",
        {
            "cursor-pointer": isSocketConnected,
            "cursor-not-allowed": !isSocketConnected,
            "hover:scale-[1.03]": isSocketConnected,
            "opacity-60": !isSocketConnected,
            "opacity-100": isSocketConnected,
        }
    );

    // when user requests updated trajectories list, set path back
    const refreshClickHandler = (): void => {
        setPath(["/"]);
        refreshHandler();
    };

    // return JSX
    return (
        <div className="relative">
            <div className="mb-4 grid grid-cols-2">
                {/* when navigating to model, reset inputs */}
                <a
                    onClick={resetInputStore}
                    // if socket is not connected, don't let into modal by clicking
                    href={isSocketConnected ? "#input" : "#"}
                    target="_self"
                    className={styleUpload}
                >
                    <ArrowsPointingOutIcon className="h-5 w-5" />
                    <p>Upload & Compute Trajectory</p>
                </a>
                <div className="flex h-fit w-fit items-center divide-slate-400 justify-self-end rounded-lg px-2 py-1 shadow-md ring-1 ring-slate-200">
                    {/* if server is currently calculating a trajectory, show the progress here */}
                    {serverState.isServerCalc && (
                        <>
                            <p className=" font-semibold">
                                Calculation Progress:
                                <span className="pl-1 font-normal">
                                    {serverState.serverProgress} /{" "}
                                    {serverState.serverNumMol}
                                </span>
                            </p>
                            <div className="mx-2 h-6 w-0.5 rounded-full bg-slate-400" />
                        </>
                    )}

                    {/* show the connection status to user (updates with a connection gained and lost) */}
                    <p className="font-semibold">
                        Status:{" "}
                        <span className={statusClasses}>
                            {isSocketConnected ? "connected" : "disconnected"}
                        </span>
                    </p>
                </div>
            </div>

            {/* completed trajectory viewer */}
            <div className="flex max-h-[60vh] flex-col space-y-4 rounded-lg p-4 shadow-md ring-1 ring-gray-200 target:bg-red-400">
                <div className="grid h-fit w-full flex-grow grid-cols-2 rounded-lg bg-slate-200 px-8 py-1.5">
                    <div className="flex items-center justify-self-start">
                        {/* always show the slash (root). When clicked, go back to the root view */}
                        <p
                            onClick={backHandler}
                            className="cursor-pointer selection:bg-transparent"
                        >
                            {path[0]}
                        </p>
                        {/* if not at the root view, show the path with arrow */}
                        {path[1] && (
                            <>
                                <ChevronDoubleRightIcon className="ml-2 mr-2 h-4 w-4 pt-0.5" />
                                <p className="selection:bg-transparent">
                                    {path[1]}
                                </p>
                            </>
                        )}
                    </div>

                    <div className="flex space-x-5 justify-self-end">
                        {/* allow the user to too go back using the back button */}
                        <button aria-label="Back in file explorer">
                            <ArrowUturnLeftIcon
                                onClick={backHandler}
                                className="h-6 w-6 transition-all active:scale-[0.8]"
                            />
                        </button>
                        {/* allow the user to manually refresh the local state of which trajectories are on disk */}
                        <button
                            onClick={refreshClickHandler}
                            aria-label="Refresh. Get new data from server."
                        >
                            <ArrowPathIcon className={refreshClasses} />
                        </button>
                    </div>
                </div>

                {/* Component for the view of completed trajectories */}
                <CompletedView
                    setPath={setPath}
                    path={path}
                    requestFile={requestFile}
                />
            </div>

            {/* modal component which allows the uploading of a new trajectory. CSS which lives in the component determines if visible or not */}
            <Modal_c startSending={startSending} />
        </div>
    );
};

export default Files;
