import { parentPort, workerData } from "worker_threads";
import { writeFileSync, readdirSync, mkdirSync, renameSync, rmSync } from "fs";
import { extname } from "path";
import { execSync } from "child_process";
import type { workerData_t } from "../types/types";

const { startIndex, molecules, folderName } = workerData as workerData_t;

molecules.forEach((fileStr, index) => {
    const moleculeNumber = index + startIndex;

    // ===================================================
    // make molecule folder
    const moleculeFolderPath = `../files/${folderName}/logFiles/molecule_${moleculeNumber}`;
    mkdirSync(moleculeFolderPath);

    // ===================================================
    // make config and write config file

    const moleculePath = `../files/${folderName}/logFiles/molecule_${moleculeNumber}/molecule.xyz`;
    const configFile = `!ZINDO/S Conv Hueckel VeryTightSCF SlowConv DIIS NoMOPrint MiniPrint\n%rel SOCType 1 end\n\n%method FrozenCore fc_none end\n%cis NRoots 1\nMaxDim 100\nEWin -0.00001,0.00001\nend\n\n* xyzfile 0 1 ${moleculePath}\n`;

    const configPath = `${moleculeFolderPath}/orcaConfig.xyz.inp`;

    // write config
    writeFileSync(configPath, configFile);
    // write file
    writeFileSync(moleculePath, fileStr);

    // ===================================================
    // run orca and pass the config file path
    const orcaOutput = execSync(
        `bash ../orca/runOrca.sh ${configPath} ${moleculeFolderPath}/${folderName}_${moleculeNumber}.log`,
        {
            encoding: "utf-8",
        }
    );

    // ===================================================
    // cleanup

    const filesInDir = readdirSync(moleculeFolderPath);

    const fileIndex = filesInDir.findIndex((x) => extname(x) === ".log");

    renameSync(
        `${moleculeFolderPath}/${filesInDir[fileIndex]}`,
        `../files/${folderName}/logFiles/${filesInDir[fileIndex]}`
    );
    rmSync(moleculeFolderPath, { recursive: true, force: true });

    // ===================================================
    //

    const cleanedOutput = orcaOutput.split("\n").map((x) => x.trim());

    const formattedStr = `Molecule:${moleculeNumber},Lowest Energy:${cleanedOutput[0]},Maximum Energy change:${cleanedOutput[1]}\n`;

    // ===================================================
    // message parent

    parentPort?.postMessage({ moleculeNumber, formattedStr });
});
