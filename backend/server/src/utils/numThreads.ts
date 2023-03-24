export const numThreads = (
    numMol: number,
    userReqThreads: number,
    maxNumThreads: number
): number => {
    // if the number of molecules is less than user request and less than max, give the number of molecules
    if (numMol < userReqThreads && userReqThreads < maxNumThreads) {
        console.log("too many for traj");
        return numMol;
    } else if (userReqThreads > maxNumThreads) {
        console.log("Too many req");

        // if user requests more than allowed, give max
        return maxNumThreads;
    } else {
        console.log("Allowed");
        return userReqThreads;
    }
};
