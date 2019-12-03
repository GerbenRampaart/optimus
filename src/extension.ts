// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, commands, window, workspace, QuickPickItem } from 'vscode';
import { searchAndLoadAll } from './optimusConfig/loader';
import { ConfigContext } from './optimusConfig/configContext';
import { ConfigQuickPickItem } from './optimusConfig/configQuickPick';
import { writeErrors } from "./optimusConfig/errorWriter";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export const activate = async (context: ExtensionContext) => {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "optimus" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = commands.registerCommand('extension.optimus', async () => {
		// The code you place here will be executed every time your command is executed
		console.log(workspace.workspaceFolders);
		// No folder opened
		if (!workspace.workspaceFolders) {
			return;
		}
console.log(workspace.workspaceFolders[0].uri.fsPath);
		const configFiles = await searchAndLoadAll(workspace.workspaceFolders[0].uri.fsPath);

		configFiles.forEach(async (cc: ConfigContext) => {
			await writeErrors(cc);
		});

				/*
		.then((val: vscode.Uri[]) => {
			
			const panel = vscode.window.createWebviewPanel("test", "test", {
				viewColumn: vscode.ViewColumn.Two
				
			}, {
				
			});
		});*/

		const quickPicks: ConfigQuickPickItem[] = [];
		
		configFiles.forEach((cc: ConfigContext) => {
			quickPicks.push(new ConfigQuickPickItem(cc));
		});

		//quickPicks.push(new ConfigExampleQuickPickItem());

		const quickPick = window.createQuickPick<ConfigQuickPickItem>();
		
		quickPick.items = quickPicks;
		quickPick.canSelectMany = false;

		const pick = await new Promise<ConfigQuickPickItem | undefined>((resolve) => {
			quickPick.onDidChangeSelection((cqpi: ConfigQuickPickItem[]) => {
				quickPick.hide();
				resolve(cqpi[0]);
			});
			
			quickPick.onDidHide(() => {
				quickPick.dispose();
				resolve(undefined);
			});

			quickPick.show();
		});

		if (pick) {
			window.showInformationMessage(pick.label);
		}
		
	});

	context.subscriptions.push(disposable);
};

// this method is called when your extension is deactivated
export function deactivate() {}
