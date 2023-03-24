import { pathGenerator_t } from "../types/types";

export const pathGenerator = (cleanName: string): pathGenerator_t => {
    const trajectoryDir = `../files/${cleanName}`;
    const energyTxt = `${trajectoryDir}/energies.txt`;
    const logFileDir = `${trajectoryDir}/logFiles`;

    return { trajectoryDir, energyTxt, logFileDir };
};
