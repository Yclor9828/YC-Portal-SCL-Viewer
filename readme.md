## Siemens Language Support

This VS Code extension provides syntax highlighting and language tooling (diagnostics, hover, completion, and go-to-definition) for Siemens SCL / Structured Text projects, plus related TIA export formats.

Documentation: [danielv123.github.io/vscode_siemens/docs](https://danielv123.github.io/vscode_siemens/docs/index.html)

Bugs/incorrect/missing diagnostics can be reported to danielv@danielv.no - reproducible examples are appreciated.

### Features
- Syntax highlighting via TextMate grammar for Siemens source files
- Table based editor for tag table XML files
- FBD block preview from .s7dcl files
- Comment toggling and bracket pairing via language configuration
- Diagnostics and type checking via the Go language server backend
- Hover type information, completion, and go-to-definition (including quoted identifiers)
- `.s7dcl` inlay hints for `.s7res` titles + navigation from `.s7dcl` references to `.s7res` entries
- Workspace type scoping via `.plc.json` roots
- Dedicated PLC testing framework with `.scltest` support

![FBD block preview](https://files.catbox.moe/hw7udm.png)
![Tag table editor](https://files.catbox.moe/58xy42.png)
![S7DCL editor](https://files.catbox.moe/73r0zu.png)

### File associations
Files ending in `.scl`, `.st`, `.s7res`, `.s7dcl`, `.udt`, `.db`, and `.awl` will be highlighted.

PLC tag-table `.xml` files are scanned to resolve global symbols and receive dedicated XML diagnostics (for example undefined types, duplicate tag names, and name conflicts).

### Settings
- `siemensLanguageServer.goBinaryPath`: absolute path to a custom `siemens-lsp` backend binary (leave empty to use the bundled binary).

### PLC scopes with `.plc.json`
- Place a `.plc.json` file in each PLC project folder to give it an isolated type scope. This keeps types from one PLC from spilling into another when you have multiple PLCs inside one VS Code workspace.
- The language server treats the folder containing `.plc.json` (plus any extra `libraries` you list) as one scope. Every subdirectory under that PLC root automatically shares the same type index.
- **Project Libraries (v1)**: If a PLC root contains `.liblink` placeholders (e.g., under `Program blocks/Library/` or `PLC data types/Library/`), the server automatically discovers and includes sibling `../Types` as a read-only library source.
	- **GUID-Driven Matching**: Resolution is based on `TypeGuid` inside `.liblink` matching against `.libinfo`/`.libint` sidecars in the `Types` tree.
	- **Strict Sibling Layout**: The `Types` folder must be a direct sibling of the folder containing `.plc.json`.
	- **Additive**: Project-library discovery is additive and does not replace explicit `libraries` in `.plc.json`.
- Example configuration:

```
{
	"name": "PackingLine PLC",
	"description": "Main line controller",
	"libraries": [
		"../shared_types",
		"../lib/opc_blocks"
	]
}
```

- `libraries` paths are resolved relative to the `.plc.json` file and must exist to be used.
- Type lookups never fall back to other PLC roots; each `.plc.json` keeps its scope isolated.
- Editing or adding `.plc.json` files causes the language server to rescan automatically.

### Project-Library Support
The language server provides specialized support for Siemens project-library exports. This mechanism is separate from the standard `.plc.json` `libraries` list.

To use libraries exported from the TIA portal, make sure the Types directly is available as ../Types from the .plc.json indicating the root directory of the PLC. The server automatically discovers `.liblink` placeholders under the PLC root and matches them to `.libinfo` and `.libint` sidecars in the sibling `../Types` directory using their shared `TypeGuid`. This wiring enables cross-file and cross-library Go-to-Definition, Hover, and Completion support for project libraries, plus automatic invalidation and diagnostics refresh when library source or metadata files change.

### PLC Testing
The extension includes a dedicated testing framework for Structured Text using `.scltest` files. It supports both whole-program and isolated unit tests for FCs and FBs.

- **Authoring**: Write tests in the DSL to `SET` values, `WAIT_CYCLES`, and `ASSERT` boolean conditions.
- **Discovery**: Use the VS Code Test Explorer to manage and run your suites.
- **Reporting**: Failures are mapped back to the source `.scltest` lines with detailed diffs.

See [docs/testing.md](docs/testing.md) for a full guide and example snippets.
