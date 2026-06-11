# Changelog

## 0.0.1

- Initial release with basic syntax highlighting and language configuration.

## 0.1.0

- Add language server
- Check missing semicolons
- Check unclosed blocks

## 1.0.0

- Add most commonly used language features to new parser

## 1.1.0

- Add support for FC return values
- Verify no static variables in FC

## 1.2.0

- Extended YAML parser for .s7res files
- Error on access to undefined local variables, including struct support

## 1.3.0

- Add support for LTIME
- Add support for compound units in time literals (T#1h_30m)
- Don't error on VAR CONSTANT in FC
- Don't allow assignment to local constants
- Show local variable type on hover

## 1.4.0

- Add exponent operator support
- Multidimensional arrays

## 1.5.0

- Parse .s7dcl type files
- Parse .s7dcl datablock files
- Resolve datatypes across files
- Error on invalid global variables
- Support for custom length string and wstring (String[20])

## 1.6.0

- Add type indexing visualization panel
- Fix not exposing local variables parsed from SCL FBs
- Show external type definitions when hovering types in SCL variable definition sections
- Add rudimentary SCL interpreter

## 1.7.0

- Interpreter: Fix case statements with multiple labels and range labels
- Much improved test coverage
- Add cyclic execution to CLI
- Handle type coercion to booleans and alert on errors
- Fix bitstring w#16#0001 in interpreter being interpreted as strings in certain cases
- Error on multiple attribute blocks on a single variable
- Fix handling of `%` to match `MOD`
- Give lints on return types from built-in functions in expressions
- Fix not universally allowing 1/0 as a placeholder for TRUE/FALSE

## 1.8.0

- Pointer support in parser
- Parsing and interpreting of SCL networks in FBD xml blocks
- Basic FBD parser
- Highlight invalid types in .xml files
- Error on undefined variables in .xml files (missing sourcemap support)
- Maintain variable capitalization, making types and debug outputs a lot easier to read
- XML to SCL transpiler
- SCL to Go transpiler (WIP)
- Support chained assignments (#a := #b := 1;)
- Ignore control flow keywords in VAR blocks
- Do highlighting for .st files
- Base integer literals (SINT#16#FF)

## 1.9.0

- Parsing of .db files (previously DBs were only parsed in .s7dcl files)
- Fix not erroring on invalid member access of global DB

## 1.10.0

- Rewrote hover type hint to handle
  - Local and external references to DBs, instanceDBs, local structs, local instanceDBs
  - Quoted tags with spaces in them
- Fix type lookups being case-sensitive (Siemens auto-converts to correct case)
- Add a command palette entry to generate .scl files from FBD XML using the transpiler
- Support hashtags in properties (#localVar.#element was failing previously)
- Fix type inference on hovering arrays

## 1.11.0

- Add support for .udt files

## 1.12.0

- Flag access to local variables without # sign as separate linter error
- Check access of SCL function calls
- Use .plc.json files to separate multiple PLC workspaces in a single VS Code workspace to not mix types between them
- Fix quoted struct members being handled case-sensitively

## 1.13.0

- When having a dangling comma in SCL function calls, point out the comma instead of the unexpected parenthesis
- Control-click variables to go to definition
- Allow unquoted TITLE fields for blocks
- Add support for built-in types VARIANT, IP_V4, TCON_IP_v4, TADDR_Param, TSEND_C, TDISCON, TSEND, TUSEND, T_RESET, TDIAG, TDiag_Status, TCON, CONN_OUC

## 1.14.0

- Enable go-to-definition (Ctrl/Cmd+Click) for DBs, user types, and nested struct fields, including quoted identifiers and cross-file references.
- Resolve built-in structs on hover
- Show source file path in type hover preview
- Add "Compound part of instruction expected" error for CASE conditions without any statements
- Validate function call parameter names
- Validate function call parameter datatypes
- Validate length of string when assigning string literals (does not support string length defined by constants)

## 2.0.0

This release contains a full rewrite of the LSP in Go, targeting improved maintainability, performance, and more dynamic language parsing.

- VS Code extension now runs on the Go backend for diagnostics, hover, completion, and go-to-definition.
- Improved editor UX and navigation:
  - Go-to-definition for function/FB calls and types in variable declarations.
  - Better support for quoted identifiers (including spaces and dotted segments) in hover, completion, and go-to-definition.
  - Completion filtering by scope; local variable completions now automatically insert the required `#` prefix.
  - Inlay hints for `.s7res` titles in `.s7dcl`, plus Cmd/Ctrl+Click to jump from `.s7dcl` references to the corresponding `.s7res` entry.
  - Fix Windows file URI normalization for more reliable cross-platform navigation.
- Expanded language and file support:
  - Partial `.s7dcl` parsing (container-aware) to support `.s7res` linkage.
  - `.s7res` parsing and validation, including resource ID and localization ID checks.
  - `.awl` parsing and diagnostics (plus better mixed-content file handling).
  - Resolve globals from PLC tag-table XML for fewer "undefined" diagnostics.
- More semantic diagnostics:
  - Type-coercion matrix checks (including warnings) and improved numeric range/precision diagnostics.
  - Stronger array indexing support (partial multidimensional indexing) and validation (types, dimensions, and static bounds).
  - Added parsing/checking for `WHILE`, `EXIT`, `CONTINUE`, pointer literals with `BYTE` length, and `MOD`.
  - Improved type inference for logical and bitwise operators.
- Faster analysis on larger projects, about 300k lines/second on M3 Pro
  - CLI `siemens-lsp check` supports folder inputs, parallel jobs (`--jobs`), optional warnings output (`--show-warnings`), and prints a metrics summary.
- Removed with the legacy TypeScript backend:
  - Types explorer tree view.
  - FBD XML → SCL conversion command.
  - Legacy rescan/index progress notifications.

## 2.0.1

- Re-add support for AT syntax
- Re-add support for legacy .udt files
- Re-add support for header keywords NON_RETAIN, STANDARD, KNOW_HOW_PROTECT, UNLINKED, READ_ONLY, CODE_VERSION<digits>
- Fix AWL function block network end terminator detection

## 2.1.0

- Add full support for `.s7dcl` files with FBD and SCL networks.
- Show .s7res comment overlays in more places
- Show function block interface comments when hovering over function block pins

## 2.2.0

- Add preview FBD view to show function block networks graphically in .s7dcl files
- 20% overall speedup, 10x speedup on hover diagnostics

## 2.3.0

- Add `siemens-lsp transpile` command to convert `.s7dcl` diagram networks (FBD/LAD) to SCL with diagnostics.
- Add `siemens-lsp go-gen` command to generate a **runnable Go PLC project** from SCL and `.s7dcl` sources.
- Add graphical tag table XML editor

## 2.3.1

- Fix bundled README screenshot paths so the extension listing and documentation previews render correctly.

## 2.3.2

- Switch README screenshots to externally hosted images for more reliable rendering on extension marketplaces and package viewers.

## 2.4.0

- Add PLC debugging in VS Code with `plc` launch configs, breakpoints, `stopOnEntry`, and custom `entryOb` selection.
- Add `PLC Debug Dashboard` and `PLC Live Watch` views with live values while the PLC keeps running.
- Add inline live-value overlays in SCL and support editing watched values during debug sessions.
- Add `.scltest` language support, Test Explorer integration, and `npx plccheck test` for CLI and CI runs.
- Support whole-program tests via `TEST_ENTRY` and isolated FC/FB tests via `TEST_TARGET`.
- Improve `.scltest` completions, generated runners, builtin state isolation, runtime builtin coverage, and lowering for `VAR_GLOBAL`, `FOR ... BY`, `LEN`, `MOD`, multiline sourcemaps, and stateful builtin arguments.

## 2.5.0

- Add code coverage reporting
- Much improved .scltest language support
  - Context aware completions
  - Better assertions
  - WAIT_UNTIL xx TIMEOUT T#100ms;
  - HOLD xx to write a variable every cycle
  - RELEASE and RELEASE_ALL to release held variables
  - ASSERT_NEAR left := right TOLERANCE 10.0; - Assert that two values are within a certain distance of each other, useful for floating point comparisons

## 2.6.0

- Add project library support
- Allow using constants for array bounds
- Support ARRAY[*] syntax for variable-length arrays
- Expand go-gen builtin/runtime support and call lowering for existing Siemens builtins supported by the LSP, including timers, record I/O, safety blocks, time reads, and communication helpers.
- Support additional Siemens syntax forms including `**`, `*=`, `/=`, `MOD`, multilingual `(/* ... */)` comments, aggregate/repetition initializers, overlay selectors like `%B0`/`%W1`, and improve quoted function result handling in `.s7dcl` diagnostics.

## 2.6.2

- Fix checking PLC folders with shared top-level Types files and mixed rootless files
- Validate FBD boolean operator shapes more strictly
- Allow valid TIA-exported FBD compare, timer, and boolean-operator chains

## 2.7.0

- Add outline panel with support for showing symbols in .s7dcl and .scl files
- Show interface comments on hover, including comments resolved from .s7res files
- Show VAR CONSTANT values on hover

## 2.8.0

- Add SCL_DUPLICATE_INSTANCE_CALL and S7DCL_FBD_DUPLICATE_INSTANCE_CALL warnings for calling the same function block instance twice in the same file

## 2.9.0

- Add syntax aware colde folding to editor and outline
- Add references (cross-references) with right click -> go to references or shift+F12
- Add right click -> show call hierarchy or shift+alt+H
- Renamed diagnostics codes to be more descriptive

## 2.10.0

- Add TIA openness integration to plccheck
- Make OPC server siemens compatible - can now connect ignition directly to the debugger runtime
- Fix bug where PLC memory for some builtins was shared between parallel unit tests
- Update docs
