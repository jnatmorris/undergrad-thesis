import React from "react";
import { UploadModal_c } from "../upload/index";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import { useSocketStore } from "../../socket";
import classnames from "classnames";

interface Props {
    startSending: () => void;
}

export const Modal_c: React.FC<Props> = ({ startSending }) => {
    // access server state object
    const { serverState } = useSocketStore();

    // employ state based styling dependent on if trajectory is being computed
    const opacityChange = classnames(
        "rounded-lg border",
        "border-slate-400",
        "bg-white",
        "px-1.5",
        "py-0.5",
        "font-medium",
        "text-slate-600",
        "no-underline",
        "shadow-sm",
        "selection:bg-transparent",
        { "opacity-100": !serverState.isServerCalc },
        { "cursor-not-allowed": serverState.isServerCalc },
        { "opacity-50": serverState.isServerCalc },
        { "cursor-pointer": !serverState.isServerCalc }
    );

    // control modal visibility based upon being the target using CSS. Target is determined based upon the id of the div being the hash
    return (
        <div
            id="input"
            className="group invisible absolute left-0 top-0 bg-white/95 opacity-0 transition-all duration-[450ms] target:visible target:opacity-95"
        >
            {/* click outside of modal, then back to main page */}
            <a
                href="#"
                target="_self"
                className="fixed inset-0 left-0 top-0 cursor-pointer"
            />

            <div className="rounded-lg pt-1 shadow-md ring-1 ring-slate-200 backdrop-blur-md">
                <div className="flex h-[60vh] flex-col px-6 py-4">
                    {/* Component which houses the file and thread input fields */}
                    <UploadModal_c />
                </div>

                {/* footer of modal */}
                <div className="flex justify-end space-x-5 bg-slate-100 py-3 pr-2">
                    {/* if clicking cancel, close modal */}
                    <a
                        className="flex scale-100 items-center space-x-1.5 rounded-lg border bg-red-300 px-1.5 py-0.5 font-medium text-slate-600 no-underline shadow-sm transition-all duration-200 selection:bg-transparent active:scale-95"
                        href="#"
                    >
                        <ArrowsPointingInIcon className="h-5 w-5" />
                        <p>Close</p>
                    </a>
                    {/* if server is already computing, don't close model, else do */}
                    <a
                        href={serverState.isServerCalc ? "#input" : "#"}
                        className={opacityChange}
                        onClick={startSending}
                    >
                        Upload & Compute
                    </a>
                </div>
            </div>
        </div>
    );
};
