import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand('track-files.createJson', () => {
 const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    const filePath = activeEditor.document.uri.fsPath;
    const fileName = path.basename(filePath);
    const jsonFilePath = path.join(vscode.workspace.rootPath || '', 'fileData.json');

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
      let fileData = {};
      if (!err) {
        // If the file exists and it is not empty, parse the JSON
        if (data.trim() !== '') {
          fileData = JSON.parse(data);
        }
      }

      // Add the new data
      fileData[fileName] = filePath;

      // Write the updated data back to the file
      fs.writeFile(jsonFilePath, JSON.stringify(fileData, null, 2), (err) => {
        if (err) {
          vscode.window.showErrorMessage('Failed to update JSON file');
        } else {
          vscode.window.showInformationMessage('JSON file updated successfully');
          vscode.workspace.openTextDocument(jsonFilePath).then((doc) => {
            vscode.window.showTextDocument(doc);
            vscode.commands.executeCommand('revealInExplorer', vscode.Uri.file(jsonFilePath));
          });
        }
      });
    });
  }
}));

  const command = 'track-files.sayHello';
  const commandHandler = (name: string = 'world') => {
    vscode.window.showInformationMessage(`Hello ${name}!!!`);
  };

  context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));

  context.subscriptions.push(vscode.commands.registerCommand('track-files.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from track-files!');
  }));

  vscode.window.onDidChangeTextEditorSelection(event => {
    const selectedText = vscode.window.activeTextEditor?.document?.getText(event.selections[0]);
    if (selectedText) {
      vscode.window.showInformationMessage(`Selected text: ${selectedText}`);
    }
  });
}
