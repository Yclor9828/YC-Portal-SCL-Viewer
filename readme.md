# YC Portal SCL Viewer

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extension-blue.svg)](https://marketplace.visualstudio.com/)

**YC Portal SCL Viewer** is a VS Code extension designed to bring robust syntax highlighting, diagnostic linting, and advanced language services to Siemens SCL / Structured Text and related TIA Portal export formats.

---

## 📢 声明与致谢 / Statement & Attribution

> [!IMPORTANT]
> **本插件是一个基于开源项目的定制修改版本 / This extension is a customized fork of:**
> * **原项目 (Original Repository):** [Dynamic Siemens Language Support](https://github.com/Danielv123/vscode_siemens)
> * **原作者 (Original Creator):** [DynamicEngineering (Danielv123)](https://github.com/Danielv123)
> * **开源协议 (License):** [CC BY-NC 4.0](LICENSE.md)
>
> **我们的修改与优化 (Our Modifications):**
> 1. **图标美化与 UI 优化 (Icon & UI Beautification)**：设计并集成了更加现代化、美观且高对比度的 SCL 关联文件图标（SVG格式），大幅提升了在 VS Code 侧边栏和文件浏览器中的辨识度。
> 2. **品牌标识优化 (Logo Branding)**：定制了全新的品牌 Logo 替换原版图标。
> 
> *非常感谢原作者 Danielv123 提供的优秀核心底座！如需获取原项目的技术文档，请访问 [vscode_siemens 官方文档](https://danielv123.github.io/vscode_siemens/docs/index.html)。*
>
> ---
>
> *We express our sincere gratitude to Danielv123 for their outstanding work on the original language server and frontend logic. For detailed technical docs, check the [Official Documentation](https://danielv123.github.io/vscode_siemens/docs/index.html).*

---

## 🚀 主要功能 / Features

本项目继承了原版强大的西门子 PLC 编程支持，主要提供以下核心功能：

### 1. 语法高亮与文件关联 (Syntax Highlighting & File Associations)
* 针对 `.scl`, `.st`, `.s7res`, `.s7dcl`, `.udt`, `.db`, `.awl` 等格式提供基于 TextMate 语法树的专业着色。
* 对 PLC 的 `.xml` 格式标签表（Tag Table）进行关联，识别全局符号。

### 2. 基于表格的标签表编辑器 (Table-Based Tag Table Editor)
* 内置 XML 标签表编辑器，支持以直观的表格形式直接阅读和编辑西门子 PLC 标签，避免手动处理繁杂的 XML 文本。

### 3. FBD 功能块图预览 (FBD Block Preview)
* 支持从 `.s7dcl` 文件自动渲染生成图形化的 FBD（功能块图）预览，方便在代码与控制逻辑图之间快速对齐。

### 4. 强大的后台语言服务器诊断 (Diagnostics & Type Checking)
* 集成了基于 Go 语言开发的 `siemens-lsp` 后端。
* 提供实时的语法分析、参数及类型安全校验（如：检测未定义的类型、重名的标签以及变量命名冲突等）。

### 5. 语言服务交互 (LSP Hover, Auto-Complete & Go-to-Definition)
* **悬停提示 (Hover)**：显示详细的类型信息、引脚描述等。
* **智能补全 (Autocomplete)**：上下文敏感的代码自动补全。
* **跳转到定义 (Go-to-Definition)**：支持快速跳转到对应的变量或块定义（甚至支持带双引号的标识符）。
* 支持 `.s7dcl` 的 Inlay hints 并能够导航跳转至 `.s7res` 条目。

### 6. 多 PLC 作用域隔离 (Multi-PLC Isolation via `.plc.json`)
* 在包含多个 PLC 的工作区中，只需在各个 PLC 的项目根目录下放置 `.plc.json`，即可实现变量和类型隔离，防止重名块和类型相互干扰。

### 7. 单元测试框架支持 (PLC Testing Framework)
* 提供了针对 Structured Text 的测试框架，支持在 `.scltest` 文件中编写 DSL 测试用例（支持 `SET` 赋值、`WAIT_CYCLES` 周期等待、`ASSERT` 断言等）。
* 支持集成到 VS Code 测试资源管理器（Test Explorer），可视化查看测试通过率及失败原因（带有详细的 Diff 校验对比）。

---

## 📸 界面预览 / Screenshots

| FBD 功能块图预览 (FBD Preview) | 标签表编辑器 (Tag Table Editor) | S7DCL 编辑器 (S7DCL Editor) |
|:---:|:---:|:---:|
| ![FBD block preview](https://files.catbox.moe/hw7udm.png) | ![Tag table editor](https://files.catbox.moe/58xy42.png) | ![S7DCL editor](https://files.catbox.moe/73r0zu.png) |

---

## 🛠️ 配置说明 / Settings

* `siemensLanguageServer.goBinaryPath`：指定自定义 `siemens-lsp` 后端二进制文件的绝对路径（留空则默认使用插件内置的二进制文件）。

---

## 📂 多 PLC 项目范围划分 (`.plc.json`)

每个 PLC 项目文件夹下可配置 `.plc.json` 文件以限制类型的作用域，配置样例如下：

```json
{
	"name": "PackingLine PLC",
	"description": "Main line controller",
	"libraries": [
		"../shared_types",
		"../lib/opc_blocks"
	]
}
```

* `libraries` 路径会相对于 `.plc.json` 的所在位置进行解析。
* 语言服务器会自动发现 PLC 根目录下的 `.liblink` 占位符，并结合同级目录下的 `../Types`（匹配其中的 `.libinfo` 和 `.libint` 描述文件）进行解析，从而为项目库提供悬停、跳转及诊断支持。

---

## 🧪 PLC 测试与校验

在 `.scltest` 文件中可以快速定义您的 FC 或 FB 测试用例。例如：

```scltest
// 示例测试结构
SET "simulator".enable_simulator := TRUE
WAIT_CYCLES 5
ASSERT "IO_simulator_DB".B1_Level == 10
```

详细的使用规范请参考 [docs/testing.md](docs/testing.md)。
