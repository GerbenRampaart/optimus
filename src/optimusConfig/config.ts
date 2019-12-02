import { YAMLException } from "js-yaml";

export interface Config {
    enabled: boolean;
    name?: string;
    sample: string;
    transformer: string;
    function: string;
}

export interface LoadedConfig {
    config: Config;
    warnings: YAMLException[];
}

export const configName = ".optimus";