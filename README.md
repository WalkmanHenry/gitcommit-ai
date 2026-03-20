# GitCommit AI

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/VS%20Code-^1.74.0-blue.svg" alt="VS Code">
  <img src="https://img.shields.io/badge/privacy-100%25%20local-success.svg" alt="Privacy">
</p>

<p align="center">
  <strong>AI-powered Git commit message generator for VS Code</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#roadmap">Roadmap</a>
</p>

---

## ✨ Features

- 🤖 **Smart Analysis** - Analyzes your code changes to generate meaningful commit messages
- 📝 **Multiple Styles** - Supports Conventional, Simple, and Detailed commit styles
- 🏷️ **Type Selection** - Manual commit type selection (feat/fix/docs/refactor/etc.)
- ⚡ **One-Click Generation** - No configuration required
- 🔒 **100% Local** - Runs entirely on your machine, no API keys, no data transmission
- 🎯 **Conventional Commits** - Follows the Conventional Commits specification

## 📦 Installation

### From VS Code Marketplace (Coming Soon)

Search for "GitCommit AI" in the VS Code Extensions marketplace.

### From VSIX (Manual)

1. Download the latest `.vsix` file from [Releases](https://github.com/WalkmanHenry/gitcommit-ai/releases)
2. Open VS Code
3. Go to Extensions → Click "..." → Install from VSIX
4. Select the downloaded file

### From Source

```bash
git clone https://github.com/WalkmanHenry/gitcommit-ai.git
cd gitcommit-ai
npm install
npm run compile
# Press F5 to launch Extension Development Host
```

## 🚀 Usage

### Quick Generate

1. Make your code changes
2. Open Source Control panel (Ctrl+Shift+G)
3. Click the sparkle ✨ icon in the toolbar
4. Commit message is automatically generated in the input box

### With Type Selection

1. Run command palette (Ctrl+Shift+P)
2. Type "Generate Commit Message with Type"
3. Select commit type (feat/fix/docs/chore/etc.)
4. Message is generated with the selected type

### Settings

Access settings via `File > Preferences > Settings` and search for "GitCommit AI":

| Setting | Default | Description |
|---------|---------|-------------|
| `gitcommit-ai.commitStyle` | `conventional` | Commit message style (conventional/simple/detailed) |
| `gitcommit-ai.maxLength` | `72` | Maximum commit message length |

## 🎯 Commit Types

The extension automatically detects the appropriate commit type based on your changes:

| Type | Description | Auto-detect Trigger |
|------|-------------|---------------------|
| `feat` | New feature | New files, feature additions |
| `fix` | Bug fix | Files with "fix" or "bug" in name |
| `docs` | Documentation | README, .md files |
| `style` | Code style | Formatting changes |
| `refactor` | Code refactoring | Structural changes |
| `test` | Tests | .test., .spec. files |
| `chore` | Build/process | Config files, package.json |

## 🗺️ Roadmap

- [ ] AI-powered description generation using local LLM
- [ ] Custom commit message templates
- [ ] Multi-language support
- [ ] Team configuration sharing
- [ ] Commit message history

## 🔒 Privacy

This extension runs **entirely locally** on your machine:
- ❌ No API calls to external services
- ❌ No data collection
- ❌ No telemetry
- ✅ All analysis happens locally using git diff

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## ☕ Support

If this extension helps you, consider supporting my work:

[![GitHub Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-WalkmanHenry-pink?logo=github)](https://github.com/sponsors/WalkmanHenry)
[![爱发电](https://img.shields.io/badge/爱发电-@WalkmanHenry-946ce6)](https://afdian.net/@WalkmanHenry)

## 📄 License

[MIT](LICENSE) © WalkmanHenry
