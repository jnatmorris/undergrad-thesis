import React from "react";
import { useSocketStore } from "../../socket";
import classnames from "classnames";

interface Props {
    setPath: React.Dispatch<React.SetStateAction<string[]>>;
    path: string[];
    requestFile: (filePath: string) => void;
}

export const CompletedView: React.FC<Props> = ({
    setPath,
    path,
    requestFile,
}) => {
    // get access to store
    const { trajectoriesOnDisk } = useSocketStore();

    // choose grid size based on path length
    const gridChooser = classnames(
        "sticky",
        "top-0",
        "mb-1",
        "grid",
        "place-items-center",
        "rounded-lg",
        "border-[1.5px]",
        "border-slate-300",
        "bg-white",
        "py-1.5",
        "pt-2",
        "shadow-sm",
        { "grid-cols-3": path.length === 1 },
        { "grid-cols-2": path.length === 2 }
    );
    return (
        <div className="divide-slate-200 overflow-y-auto">
            <div className={gridChooser}>
                {/* if at root */}
                {path.length === 1 ? (
                    <>
                        <p>Trajectory Names</p>
                        <p>Num. Molecules</p>
                        <p>Upload Date</p>
                    </>
                ) : (
                    <>
                        <p>File Name</p>
                        <p>Path on Disk From Server</p>
                    </>
                )}
            </div>
            {/* go over all trajectories */}
            {trajectoriesOnDisk.map(
                (
                    {
                        moleculeName,
                        filesInside,
                        partialPath,
                        numMolecule,
                        uploadDate,
                    },
                    index
                ) => {
                    // if at root
                    if (path.length === 1) {
                        return (
                            <div
                                key={index}
                                className="grid grid-cols-3 justify-items-center border-b border-slate-200 py-1 first:rounded-t-lg last:rounded-b-lg odd:bg-slate-100"
                            >
                                <p
                                    onClick={() =>
                                        setPath((prev) => [
                                            ...prev,
                                            moleculeName,
                                        ])
                                    }
                                    className="cursor-pointer"
                                >
                                    {moleculeName}
                                </p>
                                <p>{numMolecule}</p>
                                <p>
                                    {uploadDate.toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "numeric",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                        second: "numeric",
                                    })}
                                </p>
                            </div>
                        );
                    } else {
                        // only return if the molecule in the path is the same as molecule mapped over
                        if (path[1] !== moleculeName) return;

                        // map over all of the files included
                        return filesInside.map((singleFile, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-2 justify-items-center border-b border-slate-200 py-1 first:rounded-t-lg last:rounded-b-lg odd:bg-slate-100"
                            >
                                {/* when click, initiate the process of downloading */}
                                <p
                                    className="cursor-pointer"
                                    onClick={() =>
                                        requestFile(
                                            `${partialPath}/${singleFile}`
                                        )
                                    }
                                >
                                    {singleFile}
                                </p>
                                <p>{partialPath}</p>
                            </div>
                        ));
                    }
                }
            )}
        </div>
    );
};
