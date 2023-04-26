export const calcNumThreads_u = (
    numMol: number,
    userReqThreads: number,
    maxNumThreads: number
): number => {
    // if the number of molecules is less than user request and less than max, give the number of molecules
    if (numMol < userReqThreads && userReqThreads < maxNumThreads) {
        return numMol;
    } else if (userReqThreads > maxNumThreads) {
        // if user requests more than allowed, give max
        return maxNumThreads;
    } else {
        return userReqThreads;
    }
};
