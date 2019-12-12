import { workspace, window } from "vscode";

export const checkAndGetWorkspace = (): string | undefined => {
    
    if (!workspace.workspaceFolders) {
        window.showWarningMessage("Optimus only works with an open folder", {
            modal: true
        });
        return undefined;
    }

    return workspace.workspaceFolders[0].uri.fsPath;
};
