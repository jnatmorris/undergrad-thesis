import React from "react";
import { create } from "zustand";
import {
    useUserInputStoreActions_t,
    useUserInputStoreTrajectoryState_t,
    trajectoryData_t,
    useUserInputStoreState_t,
} from "../";

export const useUserInputStore = create<
    useUserInputStoreState_t & trajectoryData_t & useUserInputStoreActions_t
>((set) => ({
    // initial data
    trajectoryData: {
        trajectoryFile: null,
        numMolecules: null,
        trajectoriesStr: null,
    },
    configFile: null,
    numThreads: 1,
    

    // set number of threads set by user
    setNumThreads: (num: number) => set(() => ({ numThreads: num })),

    // set config file
    setConfigFile: (newConfig: File) => set(() => ({ configFile: newConfig })),

    // set the trajectory data based upon user uploaded file
    setTrajectoryData: async (newTrajectoryFile: File) => {
        // make a new promise to resolve from after reading
        const { trajectoriesStr, trajectoryFile, numMolecules } =
            await new Promise<useUserInputStoreTrajectoryState_t>(
                (resolve, reject) => {
                    const reader = new FileReader();

                    reader.onload = (e: ProgressEvent<FileReader>) => {
                        if (!e.target) return;

                        // separate massive string into 2D array
                        const trajectoriesStr = e.target.result
                            ?.toString()
                            .trim()
                            .split(/\n(?=\d+\n)/)
                            .map((val) =>
                                val.split("\n").map((elem) => elem.trim())
                            );

                        // from every molecules, remove the first two lines (this is the number of atoms, and a description)
                        const cleanedStr = trajectoriesStr?.map((x) => {
                            const y = x;
                            y.splice(0, 2);
                            return y;
                        });

                        // get the number of molecules
                        const length = cleanedStr?.length;

                        // if everything exists, continue
                        if (!cleanedStr || !length) return;

                        // resolve with the obtained data
                        resolve({
                            trajectoryFile: newTrajectoryFile,
                            numMolecules: length,
                            trajectoriesStr: cleanedStr,
                        });
                    };

                    reader.readAsText(newTrajectoryFile);
                }
            );

        set(() => ({
            trajectoryData: {
                trajectoriesStr,
                trajectoryFile,
                numMolecules,
            },
        }));
    },

    // resets store to initial values
    resetInputStore: () =>
        set(() => ({
            trajectoryData: {
                trajectoryFile: null,
                numMolecules: null,
                trajectoriesStr: null,
            },
            configFile: null,
            numThreads: 1,
        })),
}));
