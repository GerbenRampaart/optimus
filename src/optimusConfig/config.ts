import { ValidatorResult } from "jsonschema";

export interface Config {
    enabled?: boolean;
    name: string;
    sample: string;
    transformer: string;
    function: string;
}

export interface LoadedConfig {
    raw: string;
    config: Config | undefined;
    validatorResult: ValidatorResult;
}

export const configName = "optimus.yaml";