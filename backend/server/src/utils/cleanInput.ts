import { cleanInput_t } from "../types/types";

export const cleanInputs = (
    trajectoryName: string,
    trajectory: Buffer
): cleanInput_t => {
    const cleanName = trajectoryName.replace(".xyz", "").replace(".txt", "");

    const cleanTrajectory = trajectory
        .toString("utf8")
        .trim()
        .split(/\n(?=\d+\n)/)
        .map((val) =>
            val
                .split("\n")
                .map((elem) => elem.trim())
                .join("\n")
        );

    return { cleanName, cleanTrajectory };
};
