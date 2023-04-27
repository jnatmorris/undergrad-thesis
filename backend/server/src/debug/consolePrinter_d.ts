import type { messageInfo_t, tableObj_t } from "../types/types";

export const consolePrinter_d = (
    messageInfo: messageInfo_t,
    tableObj?: tableObj_t
): void => {
    // destruct object
    const { header, message } = messageInfo;

    // switch based on the header
    switch (header) {
        // Notice
        case "N":
            console.log("\x1b[33m%s\x1b[0m", "Notice:");
            break;

        // Success
        case "S":
            console.log("\n\x1b[32m%s\x1b[0m%s", "Success:", ` ${message}`);
            break;

        // Connection
        case "C":
            console.log("\x1b[32m%s\x1b[0m%s", "Connection:", ` ${message}`);
            break;

        // ERROR
        case "E":
            console.log("\x1b[31m%s\x1b[0m%s", "ERROR:", ` ${message}`);
            break;

        // Disconnection
        case "D":
            console.log("\x1b[31m%s\x1b[0m%s", "Disconnection:", ` ${message}`);
            break;
    }

    // if table passed, enter values by spreading object
    if (tableObj) {
        console.table({ ...tableObj });
        console.log("\n");
    }
};
