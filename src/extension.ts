// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, commands, window } from 'vscode';
import { searchAndLoadAll } from './optimusConfig/loader';
import { ConfigContext } from './optimusConfig/configContext';

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

		const configFiles = await searchAndLoadAll();
				/*
		.then((val: vscode.Uri[]) => {
			
			const panel = vscode.window.createWebviewPanel("test", "test", {
				viewColumn: vscode.ViewColumn.Two
				
			}, {
				
			});
		});*/
		const quickPick = configFiles.map((cc: ConfigContext) => {
			return `${cc.loadedConfig.config.name} ${cc.uri} ${cc.loadedConfig.warnings.length} warnings`;
		});
		quickPick.push("new");
		console.log(quickPick);
		const pick = await window.showQuickPick(quickPick);

		

		// Display a message box to the user
		window.showInformationMessage(pick!);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
