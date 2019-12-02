import { LoadedConfig } from "./config";
import { Uri } from "vscode";

export interface ConfigContext {
    loadedConfig: LoadedConfig;
    uri: Uri;
}