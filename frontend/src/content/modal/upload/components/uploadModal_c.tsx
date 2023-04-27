import React from "react";
import { TrajectoryFileInput_c, ConfigFileInput_c, MoleculeViewer_c } from "..";
import { useUserInputStore } from "../zustand/useUserInputStore";

interface Props {}

export const UploadModal_c: React.FC<Props> = ({}) => {
    // access input store
    const { setNumThreads, trajectoryData, numThreads } = useUserInputStore();

    return (
        <>
            <div className="h-auto space-y-4">
                <h1 className="text-3xl font-semibold text-slate-700">
                    Trajectory Upload
                </h1>
                <p className="w-2/3">
                    To compute the molecular properties of all molecules in the
                    trajectory, <span className="font-semibold">upload </span>{" "}
                    the <span className="font-semibold">trajectory</span> as
                    well as <span className="font-semibold">config</span> and
                    choose the desired number of{" "}
                    <span className="font-semibold">threads</span> for which
                    there will be simultaneous instances of Orca running.
                </p>
            </div>

            <div className="mt-8 grid flex-1 grid-cols-3 gap-x-6 gap-y-4">
                <div className="grid grid-rows-2 gap-y-4">
                    {/* file inputs */}
                    <TrajectoryFileInput_c />
                    <ConfigFileInput_c />

                    {/* number of threads input */}
                    <div className="space-y-0.5">
                        <label htmlFor="numThreadsInput">
                            Number of threads
                        </label>
                        <input
                            id="numThreadsInput"
                            type="number"
                            // when change, set the number of threads
                            onChange={(e) =>
                                setNumThreads(e.target.valueAsNumber)
                            }
                            // protect against not a number value
                            value={!isNaN(numThreads) ? numThreads : 0}
                            className="h-fit w-full rounded-md px-2 py-0.5 outline-none ring-1 ring-slate-200 focus:outline-2 focus:outline-offset-0 focus:outline-slate-200"
                            placeholder="Number of Threads"
                        />
                    </div>
                </div>

                <div className="relative col-span-2 w-full overflow-hidden rounded-lg shadow-inner">
                    {/* 3D Molecule Viewer component */}
                    <MoleculeViewer_c
                        // if trajectories string is null, give a an empty array
                        trajectoriesStr={trajectoryData.trajectoriesStr ?? [[]]}
                    />
                </div>
            </div>
        </>
    );
};
