import { toast } from "react-hot-toast";

// Although we tell browser to accept only certain extensions as not all browsers have the capability
export const CheckValidExt = (
    files: FileList | null,
    testingExt: string,
    setState: (newTrajectoryFile: File) => void
) => {
    // check if valid
    if (!files || !files[0]) return;

    // get the extension
    const extension = files[0].name.split(".").pop() || "";

    // check if the extension is valid
    if (extension !== testingExt) {
        toast.error(`Only .${testingExt} files are for this input`);
        return;
    }

    // set the state of passed set state function
    setState(files[0]);
};
