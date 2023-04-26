import type { messageInfo_t, obj_t } from "../types/types";

export const ConsolePrinter = (
    messageInfo: messageInfo_t,
    obj?: obj_t
): void => {
    const { header, message } = messageInfo;

    switch (header) {
        case "N":
            console.log("\x1b[33m%s\x1b[0m", "Notice:");
            break;

        case "S":
            console.log("\n\x1b[32m%s\x1b[0m%s", "Success:", ` ${message}`);
            break;

        case "C":
            console.log("\x1b[32m%s\x1b[0m%s", "Connection:", ` ${message}`);
            break;

        case "E":
            console.log("\x1b[31m%s\x1b[0m%s", "ERROR:", ` ${message}`);
            break;

        case "D":
            console.log("\x1b[31m%s\x1b[0m%s", "Disconnection:", ` ${message}`);
            break;
    }

    if (obj) {
        console.table({ ...obj });
        console.log("\n");
    }
};
