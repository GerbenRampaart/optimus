import { ConfigContext } from "./configContext";
import { ValidationError } from "jsonschema";
import { EOL } from "os";
import { promises } from "fs";

export const writeErrors = async (cc: ConfigContext): Promise<void> => {
    
    // If there are no errors, nothing needs to happen.
    if (cc.loadedConfig.validatorResult.errors.length === 0) {
        return;
    }

    let newFileContent = cc.loadedConfig.raw;

    cc.loadedConfig.validatorResult.errors.forEach((err: ValidationError) => {
        const errorString = `# ${err.property} => ${err.message}${EOL}`;

        // Prevent writing the error twice
        if (cc.loadedConfig.raw.indexOf(errorString) === -1) {
            newFileContent = errorString + newFileContent;
        }
    });

    await promises.writeFile(cc.path, newFileContent, {
        encoding: "utf-8"
    });
};