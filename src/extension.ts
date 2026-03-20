import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export function activate(context: vscode.ExtensionContext) {
    console.log('GitCommit AI is now active');

    let disposable = vscode.commands.registerCommand(
        'gitcommit-ai.generateCommitMessage',
        generateCommitMessage
    );

    let disposableWithType = vscode.commands.registerCommand(
        'gitcommit-ai.generateCommitMessageWithType',
        generateCommitMessageWithType
    );

    context.subscriptions.push(disposable, disposableWithType);
}

async function generateCommitMessage() {
    try {
        const diff = await getGitDiff();
        if (!diff) {
            vscode.window.showInformationMessage('No changes to commit');
            return;
        }

        const message = await analyzeDiff(diff);
        
        // Get the SCM input box
        const gitExtension = vscode.extensions.getExtension('vscode.git');
        if (gitExtension) {
            const git = gitExtension.exports.getAPI(1);
            const repo = git.repositories[0];
            if (repo) {
                repo.inputBox.value = message;
                vscode.window.showInformationMessage('Commit message generated!');
            }
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error}`);
    }
}

async function generateCommitMessageWithType() {
    const types = [
        { label: '✨ feat', description: 'New feature' },
        { label: '🐛 fix', description: 'Bug fix' },
        { label: '📝 docs', description: 'Documentation' },
        { label: '💄 style', description: 'Code style (formatting)' },
        { label: '♻️ refactor', description: 'Code refactoring' },
        { label: '⚡ perf', description: 'Performance improvement' },
        { label: '✅ test', description: 'Tests' },
        { label: '🔧 chore', description: 'Build/process changes' },
    ];

    const selected = await vscode.window.showQuickPick(types, {
        placeHolder: 'Select commit type'
    });

    if (!selected) return;

    try {
        const diff = await getGitDiff();
        if (!diff) {
            vscode.window.showInformationMessage('No changes to commit');
            return;
        }

        const type = selected.label.split(' ')[1];
        const message = await analyzeDiff(diff, type);
        
        const gitExtension = vscode.extensions.getExtension('vscode.git');
        if (gitExtension) {
            const git = gitExtension.exports.getAPI(1);
            const repo = git.repositories[0];
            if (repo) {
                repo.inputBox.value = message;
                vscode.window.showInformationMessage('Commit message generated!');
            }
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error}`);
    }
}

async function getGitDiff(): Promise<string> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        throw new Error('No workspace folder open');
    }

    const { stdout } = await execAsync('git diff --cached --stat', {
        cwd: workspaceFolder.uri.fsPath
    });

    if (!stdout.trim()) {
        // Try unstaged changes
        const { stdout: unstaged } = await execAsync('git diff --stat', {
            cwd: workspaceFolder.uri.fsPath
        });
        
        if (!unstaged.trim()) {
            return '';
        }
        
        return unstaged;
    }

    return stdout;
}

async function analyzeDiff(diffStat: string, type?: string): Promise<string> {
    // Parse the diff stat to understand what changed
    const lines = diffStat.trim().split('\n');
    const fileChanges = lines.slice(0, -1); // Last line is summary
    
    // Analyze file patterns
    const files = fileChanges.map(line => {
        const match = line.match(/(.+)\s+\|/);
        return match ? match[1].trim() : '';
    }).filter(f => f);

    // Determine change type based on files
    const hasTests = files.some(f => f.includes('.test.') || f.includes('.spec.') || f.includes('__tests__'));
    const hasDocs = files.some(f => f.includes('README') || f.includes('.md'));
    const hasConfig = files.some(f => f.includes('package.json') || f.includes('tsconfig') || f.includes('.config.'));
    
    // Generate appropriate message
    let commitType = type || 'feat';
    let description = '';
    let scope = '';

    if (!type) {
        if (hasTests && files.length === 1) {
            commitType = 'test';
        } else if (hasDocs && files.length === 1) {
            commitType = 'docs';
        } else if (hasConfig) {
            commitType = 'chore';
        } else if (files.some(f => f.includes('fix') || f.includes('bug'))) {
            commitType = 'fix';
        }
    }

    // Extract scope from file paths
    const dirNames = files.map(f => f.split('/')[0]).filter((v, i, a) => a.indexOf(v) === i);
    if (dirNames.length === 1 && dirNames[0] !== files[0]) {
        scope = `(${dirNames[0]})`;
    }

    // Generate description based on file changes
    const extensions = files.map(f => {
        const ext = f.split('.').pop();
        return ext;
    }).filter((v, i, a) => v && a.indexOf(v) === i);

    if (files.length === 1) {
        const fileName = files[0].split('/').pop()?.replace(/\.[^.]+$/, '') || '';
        description = `update ${fileName}`;
    } else if (extensions.length === 1) {
        description = `update ${extensions[0]} files`;
    } else if (hasTests && files.length <= 2) {
        description = 'add tests';
    } else if (files.length > 5) {
        description = 'multiple updates';
    } else {
        description = 'update components';
    }

    // Build commit message
    const style = vscode.workspace.getConfiguration('gitcommit-ai').get<string>('commitStyle');
    const maxLength = vscode.workspace.getConfiguration('gitcommit-ai').get<number>('maxLength') || 72;

    let message = '';
    
    switch (style) {
        case 'conventional':
            message = `${commitType}${scope}: ${description}`;
            break;
        case 'simple':
            message = description.charAt(0).toUpperCase() + description.slice(1);
            break;
        case 'detailed':
            message = `${commitType}${scope}: ${description}\n\n- Changed files: ${files.length}\n- Types: ${extensions.join(', ')}`;
            break;
        default:
            message = `${commitType}${scope}: ${description}`;
    }

    return message.length > maxLength ? message.substring(0, maxLength - 3) + '...' : message;
}

export function deactivate() {}
