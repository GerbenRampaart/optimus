import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import { Config } from "../../optimusConfig/config";
import { safeLoad } from "js-yaml";

// import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.equal(-1, [1, 2, 3].indexOf(5));
		assert.equal(-1, [1, 2, 3].indexOf(0));
	});

	test("Test reading the config file", async () => {
		const configString = readFileSync("./src/sample/optimus.yaml", "utf-8");
		const config = safeLoad(configString) as Config;
		
		assert.equal(config.enabled, true);
		assert.equal(config.function, "myTransformer");
		assert.equal(config.name, "myTransformation");
		assert.equal(config.sample, "sample.json");
		assert.equal(config.transformer, "transformer.js");
	});
});
