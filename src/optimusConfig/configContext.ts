import { LoadedConfig } from "./config";

export interface ConfigContext {
    loadedConfig: LoadedConfig;
    path: string;
    relativePath: string;
    dir: string;
}