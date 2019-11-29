export interface Config {
    enabled: boolean;
    name?: string;
    sample: string;
    transformer: string;
    function: string;
}

export const configName = ".optimus";