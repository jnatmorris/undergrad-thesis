import React from "react";
import { toast } from "react-hot-toast";
import io from "socket.io-client";
import type { serverState_t, trajectoriesOnDiskBaseEmit_t } from "../";
import { useSocketStore } from "../";
import { useUserInputStore } from "../../Modal/upload";
import { saveAs } from "file-saver";

// connect to socket server
const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_IP ?? "IP");

export const useSocket = () => {
    // gain access to stores
    const { configFile, trajectoryData, numThreads } = useUserInputStore();
    const {
        setIsConnected,
        setIsWaitingOnDisk,
        setTrajectoriesOnDisk,
        setServerState,
        serverState,
    } = useSocketStore();

    // emit to server requesting trajectories when user clicks refresh button
    const refreshHandler = () => {
        setIsWaitingOnDisk(true);
        socket.emit("reqTrajectories");
    };

    // request file from server based on path
    const requestFile = (filePath: string) => {
        socket.emit("reqFile", filePath);
    };

    //
    const startSending = () => {
        // deconstruct object
        const { trajectoryFile } = trajectoryData;

        // check if all fields are valid
        if (!trajectoryFile || !configFile || !numThreads) {
            toast.error("All felids are required to send!", { id: "needData" });
            return;
        }

        // check if the server is already calculating another trajectory
        if (serverState.isServerCalc) {
            toast.error("Server is already calculating another trajectory!", {
                id: "alreadyWorking",
            });
            return;
        }

        // if all is well, send request
        socket.emit("newCalcReq", {
            trajectory: trajectoryFile,
            orcaConfig: configFile,
            userReqThreads: numThreads,
            trajectoryName: trajectoryFile.name,
        });
    };

    // on load, request trajectories from
    React.useEffect(() => {
        socket.emit("reqTrajectories");
    }, []);

    React.useEffect(() => {
        // track if connected or not
        setIsConnected(socket.connected);

        // run when connected
        socket.on("connect", () => {
            setIsConnected(true);
        });

        // run when receiving the trajectories on disk
        socket.on("resTrajectories", (payload) => {
            // parse json and cast (assuming here we get valid data of type trajectoriesOnDiskBaseEmit_t[])
            const payloadType = JSON.parse(
                payload
            ) as trajectoriesOnDiskBaseEmit_t[];

            // map over values and convert string date to date object
            const res = payloadType.map(
                ({
                    moleculeName,
                    numMolecule,
                    filesInside,
                    uploadDate,
                    partialPath,
                }) => {
                    return {
                        moleculeName,
                        numMolecule,
                        filesInside,
                        partialPath,
                        uploadDate: new Date(Date.parse(uploadDate)),
                    };
                }
            );

            // set states accordingly
            setTrajectoriesOnDisk(res);
            setIsWaitingOnDisk(false);
        });

        // listen for when server lets everyone know of current job
        socket.on("willStartCal", (startSeverState: serverState_t) => {
            setServerState({
                ...startSeverState,
            });
        });

        // when get the file from server, save the file to use compute
        socket.on(
            "resFile",
            ({ file, fileName }: { file: Buffer; fileName: string }) => {
                saveAs(new File([file], fileName));
            }
        );

        // when getting new progress update, set state on client
        socket.on("sendProgress", (newServerStateJson) => {
            const newSeverState = JSON.parse(
                newServerStateJson
            ) as serverState_t;

            setServerState({
                ...newSeverState,
            });
        });

        // on disconnect, console log the reason and set to disconnected
        socket.on("disconnect", (reason) => {
            setIsConnected(false);
            console.table({ reason });
        });

        // cleanup function
        return () => {
            socket.off("willStartCal");
            socket.off("resFile");
            socket.off("connect");
            socket.off("resTrajectories");
            socket.off("disconnect");
            socket.off("sendProgress");
        };
    }, [
        setIsConnected,
        setIsWaitingOnDisk,
        setServerState,
        setTrajectoriesOnDisk,
        trajectoryData.numMolecules,
    ]);

    // return functions from hook
    return {
        startSending,
        requestFile,
        refreshHandler,
    };
};
