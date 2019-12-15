// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, commands, window, workspace, ViewColumn } from 'vscode';
import { transform } from './commands/transform';
import { example } from './commands/example';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export const activate = async (context: ExtensionContext) => {

	let disposableExample = commands.registerCommand('extension.optimus.example', example);
	let disposableTransform = commands.registerCommand('extension.optimus.transform', transform);

	context.subscriptions.push(disposableExample);
	context.subscriptions.push(disposableTransform);
};

// this method is called when your extension is deactivated
export function deactivate() { }
