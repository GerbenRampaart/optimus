import { QuickPickItem } from "vscode";
import { ConfigContext } from "./configContext";
import { ValidationError } from "jsonschema";

export class ConfigQuickPickItem implements QuickPickItem {
    constructor(cc: ConfigContext) {
        this.configContext = cc;
        const name = cc.loadedConfig.config ? cc.loadedConfig.config.name : "No name found";
        this.label = name,
        this.description = `${cc.relativePath}`;

        if (cc.loadedConfig.validatorResult.errors.length > 0) {
            this.detail = `This optimus config contains ${cc.loadedConfig.validatorResult.errors.length } errors`;

            /*
            cc.loadedConfig.validatorResult.errors.forEach((err: ValidationError) => {
                this.detail += `<br/>${err.message}`;
            });*/
        }
        
        this.picked = false;
        this.alwaysShow = false;
    }

    label: string;    
    description?: string | undefined;
    detail?: string | undefined;
    picked?: boolean | undefined;
    alwaysShow?: boolean | undefined;
    configContext: ConfigContext;
}

export class ConfigExampleQuickPickItem implements QuickPickItem {
    constructor() {
        this.label = "Generate Optimus Example";
        this.description = "This command will generate a new example in the ${workspace}/optimus_example directory";
        this.detail = "generate_example";
        this.picked = false;
        this.alwaysShow = true;
    }

    label: string;    
    description?: string | undefined;
    detail?: string | undefined;
    picked?: boolean | undefined;
    alwaysShow?: boolean | undefined;
}