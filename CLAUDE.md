# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ZX-M8XXX (ZX Matrix) is a vanilla JavaScript ZX Spectrum emulator with an integrated debugger for reverse engineering and game development. No build tools, no transpilation, no package manager — open `index.html` in a browser.

## Development Setup

No build system. Serve files locally for AJAX ROM loading:
```
python -m http.server 8000
```
Or open `index.html` directly (file:// protocol). ROMs go in `roms/` (gitignored).

## Running Tests

Tests are browser-based HTML pages with no CLI runner:
- `system-test.html` — System/integration tests (video timing, banking, keyboard)
- `fuse-test.html` — FUSE Z80 CPU instruction tests (exhaustive opcode validation)
- `asm-test.html` — Assembler (sjasmplus) tests
- `ula-diag.html` — ULA timing diagnostics

Open in browser, use on-page buttons to run. Tests compare rendered frames against reference PNGs in `tests/`. Test definitions are in `tests.json`.

## Architecture

### Core Module Hierarchy

`Spectrum` (in `spectrum.js`) is the main orchestrator that owns all subsystems:

```
Spectrum (6951 lines — machine integration, debugger state, UI glue)
├── Z80         (z80.js)       — CPU: opcode dispatch via 256-entry function table, contention callbacks
├── ULA         (ula.js)       — Scanline-based video, keyboard matrix, border timing, floating bus
├── Memory      (memory.js)    — RAM/ROM paging for all machine types
├── AY          (ay.js)        — AY-3-8910 sound chip (3 tone + noise + envelope)
├── Loaders     (loaders.js)   — TAP/TZX/SNA/Z80/SZX/TRD/SCL/DSK/RZX format support
├── FDC         (fdc.js)       — µPD765 floppy controller (+3 DSK images)
├── BetaDisk                   — WD1793 controller (Pentagon/Scorpion TRD/SCL)
├── Disasm      (disasm.js)    — Z80 disassembler with symbol resolution
└── AudioWorklet (audio-processor.js) — Web Audio beeper + AY output
```

### Key Design Patterns

- **Data-driven machine profiles**: `machines.js` defines all hardware parameters (RAM pages, ROM banks, timing, contention, peripherals) per machine type. No scattered string checks — add a new machine by adding a profile object.
- **Callback-based contention**: Z80 calls `contend(addr, tstates)` hooks — timing accuracy without polling.
- **State machine tape playback**: TapePlayer phases (idle→pilot→sync→data→tail→pause) match real tape timing to T-state granularity.
- **IIFE module pattern**: ES6 classes wrapped in IIFEs for namespace isolation. No ES modules or bundling.
- **Typed arrays**: `Uint8Array` throughout for memory and performance-critical buffers.

### The index.html Monolith

`index.html` is ~1.6MB and contains the full application UI, debugger, assembler editor, tools, and all HTML/CSS/JS for the frontend. The `.js` files are the emulation core loaded by this page.

### Assembler Subsystem

`sjasmplus/` contains a full sjasmplus-compatible Z80 assembler:
- `assembler.js` (engine), `lexer.js`, `parser.js`, `preprocessor.js`
- `instructions.js` (3 parts — opcode generation), `expression.js`, `labels.js`
- `vfs.js` (virtual file system), `output.js` (binary generation)

## Supported Machines

Defined in `machines.js`: 48k, 128k, +2, +2a, +3, Pentagon, Pentagon 1024, Scorpion ZS 256. Each profile specifies RAM page count, ROM banks, ULA timing variant, contention model, and available peripherals (AY, FDC, BetaDisk).

## Where to Make Changes

| Task | File(s) |
|------|---------|
| New machine type | `machines.js` (profile) + update paging/timing in `memory.js`, `ula.js` |
| New file format | `loaders.js` (add loader class, register in auto-detection) |
| CPU bug/opcode fix | `z80.js` (opcode table + timing) |
| Video/timing | `ula.js` (scanline renderer, border, contention patterns) |
| Sound | `ay.js` (registers/output) or `audio-processor.js` (Web Audio) |
| Debugger/UI | `index.html` (monolith) + `spectrum.js` (state management) |
| Disk emulation | `fdc.js` (+3 µPD765) or BetaDisk code in `spectrum.js` |

## External Dependencies

Only `pako.min.js` (ZIP compression). Everything else is self-contained vanilla JS using Canvas, Web Audio, Gamepad API, and localStorage.
