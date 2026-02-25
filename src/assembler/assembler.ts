// sjasmplus-js v0.10.19 - Z80 Assembler for ZX Spectrum
// Assembler core - Multi-pass assembly orchestration

import { AssemblerError, ErrorCollector } from './errors';
import { SymbolTable, EquTable } from './labels';
import { AsmMemory } from './memory';
import { VFS } from './vfs';
import { Parser } from './parser';
import { Preprocessor } from './preprocessor';
import { InstructionEncoder, Z80Asm } from './instructions';
import { parseExpression } from './expression';
import './instructions2';
import './instructions3';

export const Assembler = {
    maxPasses: 10,
    
    currentAddress: 0,
    physicalAddress: null as number | null,
    sectionStart: 0,
    output: [] as number[],
    outputStart: 0,
    orgAddresses: [] as number[],
    lines: [] as any[],
    pass: 0,
    changed: false,
    saveCommands: [] as any[],
    md5Associations: {} as Record<string, string>,
    macroCount: 0,
    macroDefinition: null as any,
    reptState: null as any,
    includeStack: [] as string[],
    linesProcessed: 0,
    progressCallback: null as any,
    maxIncludeDepth: 32,
    
    reset() {
        this.currentAddress = 0;
        this.physicalAddress = null;
        this.sectionStart = 0;
        this.output = [];
        this.outputStart = 0;
        this.orgAddresses = [];
        this.lines = [];
        this.pass = 0;
        this.changed = false;
        this.macroCount = 0;
        this.macroDefinition = null;
        this.reptState = null;
        this.includeStack = [];
        this.saveCommands = [];
        this.md5Associations = {};
        
        SymbolTable.reset();
        EquTable.reset();
        ErrorCollector.reset();
        AsmMemory.reset();
        Preprocessor.reset();
        VFS.reset();
    },

    assemble(source, filename = '<input>', cmdDefines: any[] = []) {
        this.reset();
        
        for (const def of cmdDefines) {
            EquTable.define(def.name, def.value, 0, '<cmdline>');
        }
        
        VFS.addFile(filename, source);
        
        this.lines = Parser.parse(source, filename);
        
        return this.runPasses();
    },

    assembleProject(mainFile, cmdDefines: any[] = []) {
        this.currentAddress = 0;
        this.physicalAddress = null;
        this.sectionStart = 0;
        this.output = [];
        this.outputStart = 0;
        this.orgAddresses = [];
        this.lines = [];
        this.pass = 0;
        this.changed = false;
        this.macroCount = 0;
        this.macroDefinition = null;
        this.reptState = null;
        this.includeStack = [];
        this.saveCommands = [];
        
        SymbolTable.reset();
        EquTable.reset();
        ErrorCollector.reset();
        AsmMemory.reset();
        Preprocessor.reset();
        
        cmdDefines = cmdDefines || [];
        for (const def of cmdDefines) {
            EquTable.define(def.name, def.value, 0, '<cmdline>');
        }
        
        const file = VFS.getFile(mainFile);
        if (!file || file.error) {
            throw new AssemblerError(file ? file.error : `Main file not found: ${mainFile}`);
        }
        
        this.lines = Parser.parse(file.content, file.path);
        
        return this.runPasses();
    },

    runPasses() {
        let lastUndefinedCount = Infinity;
        
        for (this.pass = 1; this.pass <= this.maxPasses; this.pass++) {
            this.changed = false;
            this.currentAddress = 0;
            this.physicalAddress = null;
            this.sectionStart = 0;
            this.output = [];
            this.outputStart = 0;
            this.macroDefinition = null;
            this.reptState = null;
            this.includeStack = [];
            this.saveCommands = [];
            this.linesProcessed = 0;
            
            SymbolTable.prevTempLabels = SymbolTable.tempLabels;
            SymbolTable.tempLabels = {};
            SymbolTable.tempDefOrder = 0;
            SymbolTable.tempRefOrder = 0;
            
            SymbolTable.localPrefix = '';
            
            Preprocessor.ifStack = [];
            
            let lineCount = 0;
            const totalLines = this.lines.length;
            for (const line of this.lines) {
                lineCount++;
                AsmMemory.currentLine = line.line;
                AsmMemory.currentFile = line.file;
                try {
                    this.processLine(line);
                } catch (e) {
                    if (e instanceof AssemblerError) {
                        throw e;
                    }
                    ErrorCollector.error((e as Error).message, line.line, line.file);
                }
            }
            
            const undefinedSyms = SymbolTable.checkUndefined();
            
            if (undefinedSyms.length === 0 && !this.changed) {
                break;
            }
            
            if (undefinedSyms.length > 0 && undefinedSyms.length >= lastUndefinedCount && this.pass > 2) {
                const names = undefinedSyms.map(u => u.name).join(', ');
                ErrorCollector.error(`Undefined symbols: ${names}`);
            }
            
            if (undefinedSyms.length === 0 && this.changed && this.pass > 5) {
                ErrorCollector.error('Assembly failed to converge - possible circular dependency');
            }
            
            lastUndefinedCount = undefinedSyms.length;
        }
        
        if (this.pass > this.maxPasses) {
            ErrorCollector.error('Assembly did not converge within maximum passes');
        }
        
        const unused = SymbolTable.checkUnused();
        for (const u of unused) {
            ErrorCollector.warn(`Unused label: ${u.name}`, u.line, u.file);
        }
        
        return {
            success: true,
            output: this.output,
            outputStart: this.outputStart,
            orgAddresses: this.orgAddresses.slice(),
            symbols: SymbolTable.export(),
            passes: this.pass,
            warnings: ErrorCollector.warnings,
            saveCommands: this.saveCommands
        };
    },

    processLine(line) {
        this.linesProcessed = (this.linesProcessed || 0) + 1;
        if (this.progressCallback && this.linesProcessed % 5000 === 0) {
            this.progressCallback(this.pass, this.linesProcessed, null);
        }
        
        const dir = line.directive;
        
        if (this.macroDefinition) {
            if (dir === 'ENDM' || dir === 'ENDMACRO') {
                this.endMacroDefinition(line);
            } else {
                const rawLine = this.reconstructLine(line);
                this.macroDefinition.body.push(rawLine);
            }
            return;
        }

        if (this.reptState) {
            if (dir === 'ENDR' || dir === 'EDUP') {
                const expanded: string[] = [];
                const reptFile = this.reptState.file;
                const reptLine = this.reptState.startLine;
                if (this.reptState.body) {
                    for (let i = 0; i < this.reptState.count; i++) {
                        expanded.push(...this.reptState.body);
                    }
                }
                this.reptState = null;
                for (const rawLine of expanded) {
                    const parsed = Parser.parse(rawLine, reptFile || '<rept>')[0];
                    if (parsed) {
                        parsed.file = reptFile;
                        parsed.line = reptLine;
                        this.processLine(parsed);
                    }
                }
            } else {
                const rawLine = this.reconstructLine(line);
                this.reptState.body.push(rawLine);
            }
            return;
        }

        if (dir === 'IF' || dir === 'IFDEF' || dir === 'IFNDEF' || 
            dir === 'IFUSED' || dir === 'IFNUSED' ||
            dir === 'ELSE' || dir === 'ELSEIF' || dir === 'ENDIF') {
            this.processDirective(line);
            return;
        }

        if (!Preprocessor.isActive()) {
            return;
        }

        if (Preprocessor.inSTRUCT()) {
            if (dir === 'ENDS' || dir === 'ENDSTRUCT') {
                this.dirENDS(line);
                return;
            }
            const fieldName = line.label || line.instructionRaw || line.instruction;
            let fieldType = dir || (line.operands.length > 0 ? line.operands[0] : null);
            
            if (fieldName && fieldType) {
                let typeUpper = fieldType.toUpperCase();
                let size = 1;
                let defaultValue: any = null;
                
                const textMatch = typeUpper.match(/^TEXT\s+(\d+)$/);
                if (textMatch) {
                    size = parseInt(textMatch[1], 10);
                    if (line.operands.length > 1) {
                        let defStr = line.operands[1];
                        if ((defStr.startsWith('"') && defStr.endsWith('"')) ||
                            (defStr.startsWith("'") && defStr.endsWith("'"))) {
                            defStr = defStr.slice(1, -1);
                        }
                        defaultValue = { type: 'text', value: defStr, size: size };
                    }
                } else if (typeUpper.match(/^D\s+\d+$/)) {
                    size = parseInt(typeUpper.split(/\s+/)[1], 10);
                } else {
                    switch (typeUpper) {
                        case 'BYTE': case 'DB': case 'DEFB': 
                            size = 1; 
                            if (line.operands.length > 0) {
                                const val = this.evaluate(line.operands[0], line);
                                if (!val.undefined) {
                                    defaultValue = { type: 'byte', value: val.value };
                                }
                            }
                            break;
                        case 'WORD': case 'DW': case 'DEFW': 
                            size = 2; 
                            if (line.operands.length > 0) {
                                const val = this.evaluate(line.operands[0], line);
                                if (!val.undefined) {
                                    defaultValue = { type: 'word', value: val.value };
                                }
                            }
                            break;
                        case 'DWORD': case 'DD': case 'DEFD': 
                            size = 4; 
                            if (line.operands.length > 0) {
                                const val = this.evaluate(line.operands[0], line);
                                if (!val.undefined) {
                                    defaultValue = { type: 'dword', value: val.value };
                                }
                            }
                            break;
                        default:
                            const nestedStruct = Preprocessor.getSTRUCT(typeUpper);
                            if (nestedStruct) {
                                size = nestedStruct.size;
                                defaultValue = { type: 'struct', structType: typeUpper };
                            }
                    }
                }
                Preprocessor.addStructField(fieldName, size, defaultValue);
            }
            return;
        }

        if (line.label && dir !== 'EQU' && dir !== '=' && dir !== 'DEFL' && dir !== 'DEFINE' && dir !== 'UNDEFINE' && dir !== 'MACRO') {
            this.defineLabel(line.label, line.line, line.file);
        }
        
        if (line.directive) {
            this.processDirective(line);
            return;
        }
        
        if (line.instruction) {
            this.processInstruction(line);
            return;
        }
    },

    reconstructLine(line) {
        let result = '';
        const dir = line.directive?.toUpperCase();
        
        const labelConsumingDirs = ['EQU', '=', 'DEFL', 'DEFINE', 'MACRO'];
        const isLabelConsuming = labelConsumingDirs.includes(dir);
        
        if (line.label) {
            result += line.label;
            if (!isLabelConsuming && !line.label.endsWith(':')) result += ':';
            result += ' ';
        }
        if (!line.label) {
            result += '    ';
        }
        if (line.instruction) {
            result += line.instructionRaw || line.instruction;
            if (line.operands.length > 0) {
                result += ' ' + line.operands.join(', ');
            }
        }
        if (line.directive) {
            result += line.directive;
            if (line.operands.length > 0) {
                result += ' ' + line.operands.join(', ');
            }
        }
        return result;
    },

    defineLabel(label, lineNum, file) {
        const tempMatch = /^(\d+):$/.exec(label);
        if (tempMatch) {
            SymbolTable.defineTemp(parseInt(tempMatch[1]), this.currentAddress, lineNum);
            if (this.pass === 1) {
                this.changed = true;
            }
            return;
        }
        
        const oldValue = SymbolTable.getValue(label);
        SymbolTable.define(label, this.currentAddress, lineNum, file);
        
        if (oldValue.value !== this.currentAddress) {
            this.changed = true;
        }
    },

    processDirective(line) {
        const dir = line.directive;
        const ops = line.operands;
        
        switch (dir) {
            case 'ORG': this.dirORG(ops, line); break;
            case 'EQU': this.dirEQU(line); break;
            case '=':
            case 'DEFL': this.dirDEFL(line); break;
            case 'DEFINE': this.dirDEFINE(line); break;
            case 'UNDEFINE': this.dirUNDEFINE(line); break;
            case 'DB': case 'DEFB': case 'BYTE': case 'DM': case 'DEFM':
                this.dirDB(ops, line); break;
            case 'ABYTE': this.dirABYTE(ops, line); break;
            case 'ABYTEC': this.dirABYTEC(ops, line); break;
            case 'ABYTEZ': this.dirABYTEZ(ops, line); break;
            case 'DW': case 'DEFW': case 'WORD': this.dirDW(ops, line); break;
            case 'DS': case 'DEFS': case 'BLOCK': this.dirDS(ops, line); break;
            case 'DZ': this.dirDZ(ops, line); break;
            case 'DC': this.dirDC(ops, line); break;
            case 'ALIGN': this.dirALIGN(ops, line); break;
            case 'DISP': case 'PHASE': this.dirDISP(ops, line); break;
            case 'ENT': case 'DEPHASE': this.dirENT(ops, line); break;
            case 'ASSERT': this.dirASSERT(ops, line); break;
            case 'END': break;
            case 'DEVICE': this.dirDEVICE(ops, line); break;
            case 'SLOT': this.dirSLOT(ops, line); break;
            case 'PAGE': this.dirPAGE(ops, line); break;
            case 'IF': this.dirIF(ops, line); break;
            case 'IFDEF': this.dirIFDEF(ops, line); break;
            case 'IFNDEF': this.dirIFNDEF(ops, line); break;
            case 'IFUSED': this.dirIFUSED(ops, line); break;
            case 'IFNUSED': this.dirIFNUSED(ops, line); break;
            case 'ELSE': Preprocessor.processELSE(); break;
            case 'ELSEIF': this.dirELSEIF(ops, line); break;
            case 'ENDIF': Preprocessor.processENDIF(); break;
            case 'MACRO': this.startMacroDefinition(ops, line); break;
            case 'ENDM': case 'ENDMACRO': this.endMacroDefinition(line); break;
            case 'REPT': this.dirREPT(ops, line); break;
            case 'DUP': this.dirDUP(ops, line); break;
            case 'ENDR': case 'EDUP': break;
            case 'STRUCT': this.dirSTRUCT(ops, line); break;
            case 'ENDS': case 'ENDSTRUCT': this.dirENDS(line); break;
            case 'CHARSET': this.dirCHARSET(ops, line); break;
            case 'MODULE': this.dirMODULE(ops, line); break;
            case 'ENDMODULE': SymbolTable.exitModule(); break;
            case 'INCLUDE': this.dirINCLUDE(ops, line); break;
            case 'INCBIN': this.dirINCBIN(ops, line); break;
            case 'OUTPUT': break;
            case 'EMPTYTAP': this.dirEMPTYTAP(ops, line); break;
            case 'SAVEBIN': this.dirSAVEBIN(ops, line); break;
            case 'SAVESNA': this.dirSAVESNA(ops, line); break;
            case 'SAVETAP': this.dirSAVETAP(ops, line); break;
            case 'EMPTYTRD': this.dirEMPTYTRD(ops, line); break;
            case 'SAVETRD': this.dirSAVETRD(ops, line); break;
            default:
                if (this.tryMacroCall(line)) break;
                break;
        }
    },

    dirORG(ops, line) {
        if (ops.length < 1) ErrorCollector.error('ORG requires an address', line.line, line.file);
        const val = this.evaluate(ops[0], line);
        if (!val.undefined) {
            if (this.output.length === 0 && this.outputStart === 0) this.outputStart = val.value;
            if (this.pass === this.maxPasses || !this.changed) {
                if (!this.orgAddresses.includes(val.value)) this.orgAddresses.push(val.value);
            }
            this.currentAddress = val.value;
            this.sectionStart = val.value;
        }
    },

    dirEQU(line) {
        if (!line.label) ErrorCollector.error('EQU requires a label', line.line, line.file);
        if (line.operands.length < 1) ErrorCollector.error('EQU requires a value', line.line, line.file);
        const val = this.evaluate(line.operands[0], line);
        if (!val.undefined) EquTable.define(line.label, val.value, line.line, line.file);
    },

    dirDEFL(line) {
        if (!line.label) ErrorCollector.error('DEFL requires a label', line.line, line.file);
        if (line.operands.length < 1) ErrorCollector.error('DEFL requires a value', line.line, line.file);
        const val = this.evaluate(line.operands[0], line);
        SymbolTable.symbols[SymbolTable.getFullName(line.label)] = {
            value: val.value, type: 'defl', defined: !val.undefined,
            used: false, line: line.line, file: line.file
        };
    },

    dirDEFINE(line) {
        let name = line.label;
        let value: any = 1;
        
        if (!name && line.operands.length >= 1) {
            const parts = line.operands[0].trim().split(/\s+/);
            name = parts[0];
            if (parts.length >= 2) {
                const rawValue = parts.slice(1).join(' ');
                value = this.parseDefineValue(rawValue, line);
            } else if (line.operands.length >= 2) {
                value = this.parseDefineValue(line.operands[1], line);
            }
        } else if (name && line.operands.length >= 1) {
            value = this.parseDefineValue(line.operands[0], line);
        }
        
        if (!name) {
            ErrorCollector.error('DEFINE requires a symbol name', line.line, line.file);
            return;
        }
        
        EquTable.define(name, value, line.line, line.file);
    },
    
    parseDefineValue(rawValue, line) {
        const trimmed = rawValue.trim();
        if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
            (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
            return trimmed.slice(1, -1);
        }
        const val = this.evaluate(trimmed, line);
        return val.undefined ? 1 : val.value;
    },
    
    resolveFilename(op, line) {
        const trimmed = op.trim();
        if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
            (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
            return trimmed.slice(1, -1);
        }
        const val = EquTable.getValue(trimmed);
        if (val && typeof val.value === 'string') return val.value;
        const sym = SymbolTable.getValue(trimmed);
        if (sym && typeof sym.value === 'string') return sym.value;
        return trimmed;
    },

    dirUNDEFINE(line) {
        let name = line.label;
        if (!name && line.operands.length >= 1) {
            name = line.operands[0].trim().split(/\s+/)[0];
        }
        if (!name) {
            ErrorCollector.error('UNDEFINE requires a symbol name', line.line, line.file);
            return;
        }
        const fullName = SymbolTable.getFullName(name);
        delete SymbolTable.symbols[fullName];
        delete EquTable.values[name];
        delete EquTable.values[fullName];
    },

    dirDB(ops, line) {
        for (const op of ops) {
            if (op.startsWith('"') && op.endsWith('"')) {
                const str = op.slice(1, -1);
                for (let i = 0; i < str.length; i++) this.emit(str.charCodeAt(i));
            } else if (op.startsWith("'") && op.endsWith("'") && op.length > 2) {
                const str = op.slice(1, -1);
                for (let i = 0; i < str.length; i++) this.emit(str.charCodeAt(i));
            } else {
                const val = this.evaluate(op, line);
                this.emit(Z80Asm.checkByte(val.value));
            }
        }
    },

    dirDW(ops, line) {
        for (const op of ops) {
            const val = this.evaluate(op, line);
            const [lo, hi] = Z80Asm.wordBytes(val.value);
            this.emit(lo);
            this.emit(hi);
        }
    },

    dirDS(ops, line) {
        if (ops.length < 1) ErrorCollector.error('DS requires a size', line.line, line.file);
        const size = this.evaluate(ops[0], line);
        const fill = ops.length > 1 ? this.evaluate(ops[1], line).value : 0;
        if (!size.undefined) {
            for (let i = 0; i < size.value; i++) this.emit(fill & 0xFF);
        }
    },

    dirDZ(ops, line) {
        this.dirDB(ops, line);
        this.emit(0);
    },

    dirDC(ops, line) {
        for (let opIdx = 0; opIdx < ops.length; opIdx++) {
            const op = ops[opIdx];
            if (op.startsWith('"') && op.endsWith('"')) {
                const str = op.slice(1, -1);
                for (let i = 0; i < str.length; i++) {
                    let byte = str.charCodeAt(i);
                    if (i === str.length - 1 && opIdx === ops.length - 1) byte |= 0x80;
                    this.emit(byte);
                }
            } else if (op.startsWith("'") && op.endsWith("'") && op.length > 2) {
                const str = op.slice(1, -1);
                for (let i = 0; i < str.length; i++) {
                    let byte = str.charCodeAt(i);
                    if (i === str.length - 1 && opIdx === ops.length - 1) byte |= 0x80;
                    this.emit(byte);
                }
            } else {
                const val = this.evaluate(op, line);
                let byte = Z80Asm.checkByte(val.value);
                if (opIdx === ops.length - 1) byte |= 0x80;
                this.emit(byte);
            }
        }
    },

    parseAbyteOps(ops) {
        if (ops.length === 1) {
            const op = ops[0];
            const match = op.match(/^([^"']+)(["'].*)$/);
            if (match) return [match[1].trim(), match[2]];
        }
        return ops;
    },

    dirABYTE(ops, line) {
        ops = this.parseAbyteOps(ops);
        if (ops.length < 2) {
            ErrorCollector.error('ABYTE requires offset and data', line.line, line.file);
            return;
        }
        const offset = this.evaluate(ops[0], line).value;
        for (let i = 1; i < ops.length; i++) {
            const op = ops[i];
            if ((op.startsWith('"') && op.endsWith('"')) || 
                (op.startsWith("'") && op.endsWith("'") && op.length > 2)) {
                const str = op.slice(1, -1);
                for (let j = 0; j < str.length; j++) this.emit((str.charCodeAt(j) + offset) & 0xFF);
            } else {
                const val = this.evaluate(op, line);
                this.emit((val.value + offset) & 0xFF);
            }
        }
    },

    dirABYTEC(ops, line) {
        ops = this.parseAbyteOps(ops);
        if (ops.length < 2) {
            ErrorCollector.error('ABYTEC requires offset and data', line.line, line.file);
            return;
        }
        const offset = this.evaluate(ops[0], line).value;
        const bytes: number[] = [];
        for (let i = 1; i < ops.length; i++) {
            const op = ops[i];
            if ((op.startsWith('"') && op.endsWith('"')) || 
                (op.startsWith("'") && op.endsWith("'") && op.length > 2)) {
                const str = op.slice(1, -1);
                for (let j = 0; j < str.length; j++) bytes.push((str.charCodeAt(j) + offset) & 0xFF);
            } else {
                const val = this.evaluate(op, line);
                bytes.push((val.value + offset) & 0xFF);
            }
        }
        for (let i = 0; i < bytes.length; i++) {
            this.emit(i === bytes.length - 1 ? bytes[i] | 0x80 : bytes[i]);
        }
    },

    dirABYTEZ(ops, line) {
        ops = this.parseAbyteOps(ops);
        if (ops.length < 2) {
            ErrorCollector.error('ABYTEZ requires offset and data', line.line, line.file);
            return;
        }
        const offset = this.evaluate(ops[0], line).value;
        for (let i = 1; i < ops.length; i++) {
            const op = ops[i];
            if ((op.startsWith('"') && op.endsWith('"')) || 
                (op.startsWith("'") && op.endsWith("'") && op.length > 2)) {
                const str = op.slice(1, -1);
                for (let j = 0; j < str.length; j++) this.emit((str.charCodeAt(j) + offset) & 0xFF);
            } else {
                const val = this.evaluate(op, line);
                this.emit((val.value + offset) & 0xFF);
            }
        }
        this.emit(0);
    },

    dirALIGN(ops, line) {
        if (ops.length < 1) ErrorCollector.error('ALIGN requires alignment value', line.line, line.file);
        const align = this.evaluate(ops[0], line);
        const fill = ops.length > 1 ? this.evaluate(ops[1], line).value : 0;
        if (!align.undefined && align.value > 0) {
            while (this.currentAddress % align.value !== 0) this.emit(fill & 0xFF);
        }
    },

    dirDISP(ops, line) {
        if (ops.length < 1) ErrorCollector.error('DISP requires an address', line.line, line.file);
        const val = this.evaluate(ops[0], line);
        if (!val.undefined) {
            this.physicalAddress = this.currentAddress;
            this.currentAddress = val.value;
        }
    },

    dirENT(ops, line) {
        if (this.physicalAddress !== null) {
            this.currentAddress = this.physicalAddress;
            this.physicalAddress = null;
        }
    },

    dirASSERT(ops, line) {
        if (ops.length < 1) ErrorCollector.error('ASSERT requires a condition', line.line, line.file);
        if (this.pass < 2) return;
        const val = this.evaluate(ops[0], line);
        if (!val.undefined && val.value === 0) {
            const msg = ops.length > 1 ? ops[1] : 'Assertion failed';
            ErrorCollector.error(`ASSERT: ${msg}`, line.line, line.file);
        }
    },

    dirDEVICE(ops, line) {
        if (ops.length < 1) ErrorCollector.error('DEVICE requires a device name', line.line, line.file);
        AsmMemory.setDevice(ops[0]);
    },

    dirSLOT(ops, line) {
        if (ops.length < 1) ErrorCollector.error('SLOT requires a slot number', line.line, line.file);
        const val = this.evaluate(ops[0], line);
        if (!val.undefined) AsmMemory.setCurrentSlot(val.value);
    },

    dirPAGE(ops, line) {
        if (ops.length < 1) ErrorCollector.error('PAGE requires a page number', line.line, line.file);
        const val = this.evaluate(ops[0], line);
        if (!val.undefined) AsmMemory.setSlot(AsmMemory.currentSlot, val.value);
    },

    dirIF(ops, line) {
        if (ops.length < 1) { ErrorCollector.error('IF requires an expression', line.line, line.file); return; }
        Preprocessor.processIF(ops[0], SymbolTable.toObject());
    },

    dirIFDEF(ops, line) {
        if (ops.length < 1) { ErrorCollector.error('IFDEF requires a symbol name', line.line, line.file); return; }
        Preprocessor.processIFDEF(ops[0], SymbolTable.toObject());
    },

    dirIFNDEF(ops, line) {
        if (ops.length < 1) { ErrorCollector.error('IFNDEF requires a symbol name', line.line, line.file); return; }
        Preprocessor.processIFNDEF(ops[0], SymbolTable.toObject());
    },

    dirIFUSED(ops, line) {
        if (ops.length < 1) { ErrorCollector.error('IFUSED requires a symbol name', line.line, line.file); return; }
        Preprocessor.processIFUSED(ops[0], SymbolTable.symbols);
    },

    dirIFNUSED(ops, line) {
        if (ops.length < 1) { ErrorCollector.error('IFNUSED requires a symbol name', line.line, line.file); return; }
        Preprocessor.processIFNUSED(ops[0], SymbolTable.symbols);
    },

    dirELSEIF(ops, line) {
        if (ops.length < 1) { ErrorCollector.error('ELSEIF requires an expression', line.line, line.file); return; }
        Preprocessor.processELSEIF(ops[0], SymbolTable.toObject());
    },

    startMacroDefinition(ops, line) {
        let name, params: string[] = [];
        
        if (ops.length === 0 && line.label) {
            name = line.label;
        } else if (ops.length >= 1) {
            const firstParts = ops[0].trim().split(/\s+/);
            name = firstParts[0];
            if (firstParts.length > 1) params.push(...firstParts.slice(1));
            params.push(...ops.slice(1));
        } else {
            ErrorCollector.error('MACRO requires a name', line.line, line.file);
            return;
        }
        
        this.macroDefinition = { name, params, body: [] };
    },

    endMacroDefinition(line) {
        if (!this.macroDefinition) {
            ErrorCollector.error('ENDM without MACRO', line.line, line.file);
            return;
        }
        Preprocessor.defineMacro(this.macroDefinition.name, this.macroDefinition.params, this.macroDefinition.body);
        this.macroDefinition = null;
    },

    tryMacroCall(line) {
        const name = line.directive;
        if (!Preprocessor.isMacro(name)) return false;
        if (!Preprocessor.isActive()) return true;
        
        if (name.toUpperCase() === 'MD5CHECK' && line.operands.length >= 2) {
            const filename = this.resolveFilename(line.operands[0], line);
            const md5 = this.resolveFilename(line.operands[1], line);
            if (filename && md5 && /^[a-fA-F0-9]{32}$/.test(md5)) {
                this.md5Associations[filename.toLowerCase()] = md5.toLowerCase();
            }
        }
        
        this.macroCount++;
        const expanded = Preprocessor.expandMacro(name, line.operands, this.macroCount);
        if (expanded) {
            for (const expandedLine of expanded) {
                const parsed = Parser.parse(expandedLine, line.file || '<macro>')[0];
                if (parsed) {
                    parsed.file = line.file;
                    parsed.line = line.line;
                    this.processLine(parsed);
                }
            }
        }
        return true;
    },

    dirREPT(ops, line) {
        if (ops.length < 1) { ErrorCollector.error('REPT requires a count', line.line, line.file); return; }
        const val = this.evaluate(ops[0], line);
        if (!val.undefined) {
            this.reptState = { count: val.value, body: [], startLine: line.line, file: line.file };
        }
    },

    dirDUP(ops, line) { this.dirREPT(ops, line); },

    dirSTRUCT(ops, line) {
        if (ops.length < 1) { ErrorCollector.error('STRUCT requires a name', line.line, line.file); return; }
        Preprocessor.startSTRUCT(ops[0]);
    },

    dirENDS(line) {
        const struct = Preprocessor.endSTRUCT();
        if (struct) {
            EquTable.define(struct.name, struct.offset, line.line, line.file);
            for (const field of struct.fields) {
                EquTable.define(`${struct.name}.${field.name}`, field.offset, line.line, line.file);
                if (field.defaultValue && field.defaultValue.type === 'struct') {
                    const nestedDef = Preprocessor.getSTRUCT(field.defaultValue.structType);
                    if (nestedDef) {
                        for (const nestedField of nestedDef.fields) {
                            const combinedOffset = field.offset + nestedField.offset;
                            EquTable.define(`${struct.name}.${field.name}.${nestedField.name}`, combinedOffset, line.line, line.file);
                        }
                    }
                }
            }
        }
    },

    dirCHARSET(ops, line) {
        if (ops.length === 0) { Preprocessor.resetCHARSET(); return; }
        if (ops.length >= 3) {
            const from = ops[0].replace(/['"]/g, '');
            const to = ops[1].replace(/['"]/g, '');
            const val = this.evaluate(ops[2], line);
            if (!val.undefined) Preprocessor.setCHARSET(from, to, val.value);
        } else if (ops.length === 2) {
            const from = this.evaluate(ops[0], line);
            const to = this.evaluate(ops[1], line);
            if (!from.undefined && !to.undefined) Preprocessor.setCHARSET(from.value, to.value, 0);
        }
    },

    dirMODULE(ops, line) {
        if (ops.length < 1) { ErrorCollector.error('MODULE requires a name', line.line, line.file); return; }
        SymbolTable.enterModule(ops[0]);
    },

    dirINCLUDE(ops, line) {
        if (ops.length < 1) { ErrorCollector.error('INCLUDE requires a filename', line.line, line.file); return; }
        let filename = ops[0];
        if ((filename.startsWith('"') && filename.endsWith('"')) ||
            (filename.startsWith("'") && filename.endsWith("'"))) {
            filename = filename.slice(1, -1);
        }
        if (this.includeStack.length >= this.maxIncludeDepth) {
            ErrorCollector.error(`Include depth exceeded (max ${this.maxIncludeDepth})`, line.line, line.file);
            return;
        }
        const file = VFS.getFile(filename, line.file);
        if (!file || file.error) {
            ErrorCollector.error(file ? file.error : `File not found: ${filename}`, line.line, line.file);
            return;
        }
        if (this.includeStack.includes(file.path)) {
            ErrorCollector.error(`Circular include detected: ${filename}`, line.line, line.file);
            return;
        }
        this.includeStack.push(file.path);
        const includedLines = Parser.parse(file.content, file.path);
        if (includedLines) {
            for (const includedLine of includedLines) this.processLine(includedLine);
        }
        this.includeStack.pop();
    },

    dirINCBIN(ops, line) {
        if (ops.length < 1) { ErrorCollector.error('INCBIN requires a filename', line.line, line.file); return; }
        let filename = ops[0];
        if ((filename.startsWith('"') && filename.endsWith('"')) ||
            (filename.startsWith("'") && filename.endsWith("'"))) {
            filename = filename.slice(1, -1);
        }
        let offset = 0;
        let length = -1;
        if (ops.length >= 2) {
            const offsetVal = this.evaluate(ops[1], line);
            if (!offsetVal.undefined) offset = offsetVal.value;
        }
        if (ops.length >= 3) {
            const lengthVal = this.evaluate(ops[2], line);
            if (!lengthVal.undefined) length = lengthVal.value;
        }
        const file = VFS.getBinaryFile(filename, line.file);
        if (file.error) { ErrorCollector.error(file.error, line.line, line.file); return; }
        let data = file.content;
        if (offset > 0) {
            if (offset >= data.length) {
                ErrorCollector.error(`INCBIN offset ${offset} exceeds file size ${data.length}`, line.line, line.file);
                return;
            }
            data = data.slice(offset);
        }
        if (length >= 0) {
            if (length > data.length) ErrorCollector.warn(`INCBIN length ${length} exceeds available data ${data.length}`, line.line, line.file);
            data = data.slice(0, length);
        }
        if (data) {
            for (const byte of data) this.emit(byte);
        }
    },

    extractExpectedMD5(comment) {
        if (!comment) return null;
        const match = comment.match(/;\s*md5(?:\s*check)?:\s*([a-fA-F0-9]{32})/i);
        return match ? match[1].toLowerCase() : null;
    },
    
    getExpectedMD5(filename, comment) {
        const commentMD5 = this.extractExpectedMD5(comment);
        if (commentMD5) return commentMD5;
        if (filename && this.md5Associations[filename.toLowerCase()]) {
            return this.md5Associations[filename.toLowerCase()];
        }
        return null;
    },

    dirSAVEBIN(ops, line) {
        if (ops.length < 1) { ErrorCollector.error('SAVEBIN requires filename', line.line, line.file); return; }
        const filename = this.resolveFilename(ops[0], line);
        let start = this.outputStart;
        let length = -1;
        if (ops.length >= 2) { const v = this.evaluate(ops[1], line); if (!v.undefined) start = v.value; }
        if (ops.length >= 3) { const v = this.evaluate(ops[2], line); if (!v.undefined) length = v.value; }
        let capturedData: Uint8Array | null = null;
        const actualLength = length > 0 ? length : 
            (AsmMemory.device ? 0x10000 - start : Math.max(0, this.output.length - (start - this.outputStart)));
        if (actualLength > 0) {
            if (AsmMemory.device) {
                capturedData = new Uint8Array(actualLength);
                for (let i = 0; i < actualLength; i++) capturedData[i] = AsmMemory.readByte(start + i);
            } else if (start >= this.outputStart) {
                const dataStart = start - this.outputStart;
                capturedData = new Uint8Array(this.output.slice(dataStart, dataStart + actualLength));
            }
        }
        this.saveCommands.push({ type: 'bin', filename, start, length, capturedData, expectedMD5: this.getExpectedMD5(filename, line.comment) });
    },

    dirSAVESNA(ops, line) {
        if (ops.length < 1) { ErrorCollector.error('SAVESNA requires filename', line.line, line.file); return; }
        const filename = this.resolveFilename(ops[0], line);
        let startAddr = this.outputStart;
        if (ops.length >= 2) { const v = this.evaluate(ops[1], line); if (!v.undefined) startAddr = v.value; }
        this.saveCommands.push({ type: 'sna', filename, start: startAddr, expectedMD5: this.getExpectedMD5(filename, line.comment) });
    },

    dirEMPTYTAP(ops, line) {
        if (ops.length < 1) { ErrorCollector.error('EMPTYTAP requires filename', line.line, line.file); return; }
        const filename = this.resolveFilename(ops[0], line);
        this.saveCommands.push({ type: 'emptytap', filename });
    },

    dirSAVETAP(ops, line) {
        if (ops.length < 1) { ErrorCollector.error('SAVETAP requires filename', line.line, line.file); return; }
        const filename = this.resolveFilename(ops[0], line);
        let blockType = 'SNAPSHOT';
        let blockName = filename.replace(/\.tap$/i, '').slice(0, 10);
        let startAddr = this.outputStart;
        let length = -1;
        let param1 = 0;
        let param2 = -1;
        if (ops.length >= 2) {
            const second = ops[1].toUpperCase();
            if (second === 'BASIC' || second === 'CODE' || second === 'NUMBERS' || 
                second === 'CHARS' || second === 'HEADLESS') {
                blockType = second;
                if (blockType === 'HEADLESS') {
                    param1 = 0xFF;
                    if (ops.length >= 3) { const v = this.evaluate(ops[2], line); if (!v.undefined) startAddr = v.value; }
                    if (ops.length >= 4) { const v = this.evaluate(ops[3], line); if (!v.undefined) length = v.value; }
                    if (ops.length >= 5) { const v = this.evaluate(ops[4], line); if (!v.undefined) param1 = v.value; }
                } else {
                    if (ops.length >= 3) blockName = this.resolveFilename(ops[2], line).slice(0, 10);
                    if (ops.length >= 4) { const v = this.evaluate(ops[3], line); if (!v.undefined) startAddr = v.value; }
                    if (ops.length >= 5) { const v = this.evaluate(ops[4], line); if (!v.undefined) length = v.value; }
                    if (ops.length >= 6) {
                        let p1 = ops[5];
                        if ((p1.startsWith("'") && p1.endsWith("'")) && p1.length === 3) {
                            param1 = p1.charCodeAt(1);
                        } else {
                            const v = this.evaluate(ops[5], line); if (!v.undefined) param1 = v.value;
                        }
                    }
                    if (ops.length >= 7) { const v = this.evaluate(ops[6], line); if (!v.undefined) param2 = v.value; }
                }
            } else {
                const v = this.evaluate(ops[1], line);
                if (!v.undefined) startAddr = v.value;
            }
        }
        let capturedData: Uint8Array | null = null;
        const actualLength = length > 0 ? length : 
            (AsmMemory.device ? 0x10000 - startAddr : Math.max(0, this.output.length - (startAddr - this.outputStart)));
        if (actualLength > 0) {
            if (AsmMemory.device) {
                capturedData = new Uint8Array(actualLength);
                for (let i = 0; i < actualLength; i++) capturedData[i] = AsmMemory.readByte(startAddr + i);
            } else if (startAddr >= this.outputStart) {
                const dataStart = startAddr - this.outputStart;
                capturedData = new Uint8Array(this.output.slice(dataStart, dataStart + actualLength));
            }
        }
        this.saveCommands.push({ type: 'tap', filename, blockType, blockName, start: startAddr, length, param1, param2, capturedData, expectedMD5: this.getExpectedMD5(filename, line.comment) });
    },

    dirEMPTYTRD(ops, line) {
        if (ops.length < 1) { ErrorCollector.error('EMPTYTRD requires filename', line.line, line.file); return; }
        const filename = this.resolveFilename(ops[0], line);
        const label = ops.length >= 2 ? this.resolveFilename(ops[1], line) : 'sjasmplus';
        this.saveCommands.push({ type: 'emptytrd', filename, label, expectedMD5: this.getExpectedMD5(filename, line.comment) });
    },

    dirSAVETRD(ops, line) {
        if (ops.length < 2) { ErrorCollector.error('SAVETRD requires disk filename and file name', line.line, line.file); return; }
        const diskFilename = this.resolveFilename(ops[0], line);
        const innerFilename = this.resolveFilename(ops[1], line).substring(0, 8);
        let fileType = 'C';
        let startAddr = this.outputStart;
        let length = -1;
        let opIndex = 2;
        if (ops.length >= 3) {
            const third = ops[2].toUpperCase();
            if (third === 'BASIC' || third === 'CODE' || third === 'DATA' || 
                third === "'B'" || third === "'C'" || third === "'D'" || third === "'#'" ||
                third === 'B' || third === 'C' || third === 'D') {
                fileType = third.replace(/'/g, '').charAt(0);
                opIndex = 3;
            }
        }
        if (ops.length > opIndex) { const v = this.evaluate(ops[opIndex], line); if (!v.undefined) startAddr = v.value; }
        if (ops.length > opIndex + 1) { const v = this.evaluate(ops[opIndex + 1], line); if (!v.undefined) length = v.value; }
        let capturedData: Uint8Array | null = null;
        const actualLength = length > 0 ? length : 
            (AsmMemory.device ? 0x10000 - startAddr : Math.max(0, this.output.length - (startAddr - this.outputStart)));
        if (actualLength > 0) {
            if (AsmMemory.device) {
                capturedData = new Uint8Array(actualLength);
                for (let i = 0; i < actualLength; i++) capturedData[i] = AsmMemory.readByte(startAddr + i);
            } else if (startAddr >= this.outputStart) {
                const dataStart = startAddr - this.outputStart;
                capturedData = new Uint8Array(this.output.slice(dataStart, dataStart + actualLength));
            }
        }
        this.saveCommands.push({ type: 'trd', trdFilename: diskFilename, innerFilename, filename: diskFilename, fileType, start: startAddr, startAddr, length, capturedData, expectedMD5: this.getExpectedMD5(diskFilename, line.comment) });
    },

    processInstruction(line) {
        const macroName = line.instructionRaw || line.instruction;
        if (Preprocessor.isMacro(macroName)) {
            if (macroName.toUpperCase() === 'MD5CHECK' && line.operands.length >= 2) {
                const filename = this.resolveFilename(line.operands[0], line);
                const md5 = this.resolveFilename(line.operands[1], line);
                if (filename && md5 && /^[a-fA-F0-9]{32}$/.test(md5)) {
                    this.md5Associations[filename.toLowerCase()] = md5.toLowerCase();
                }
            }
            this.macroCount++;
            const expanded = Preprocessor.expandMacro(macroName, line.operands, this.macroCount);
            if (expanded) {
                for (const expandedLine of expanded) {
                    const parsed = Parser.parse(expandedLine, line.file || '<macro>')[0];
                    if (parsed) { parsed.file = line.file; parsed.line = line.line; this.processLine(parsed); }
                }
            }
            return;
        }

        const structDef = Preprocessor.getSTRUCT(macroName);
        if (structDef) {
            for (let i = 0; i < structDef.fields.length; i++) {
                const field = structDef.fields[i];
                let operand = i < line.operands.length ? line.operands[i] : null;
                const isEmpty = !operand || operand.trim() === '';
                if (!isEmpty) {
                    let strValue: string | null = null;
                    if ((operand.startsWith('"') && operand.endsWith('"')) ||
                        (operand.startsWith("'") && operand.endsWith("'"))) {
                        strValue = operand.slice(1, -1);
                    }
                    const strMatch = operand.match(/^\{['"](.*)['"]\}$/);
                    if (strMatch) strValue = strMatch[1];
                    if (strValue !== null) {
                        for (let b = 0; b < field.size; b++) this.emit(b < strValue.length ? strValue.charCodeAt(b) : 0x20);
                        continue;
                    }
                    const val = this.evaluate(operand, line);
                    if (!val.undefined) {
                        for (let b = 0; b < field.size; b++) this.emit((val.value >> (b * 8)) & 0xFF);
                        continue;
                    }
                }
                if (field.defaultValue) {
                    if (field.defaultValue.type === 'text') {
                        const str = field.defaultValue.value;
                        for (let b = 0; b < field.size; b++) this.emit(b < str.length ? str.charCodeAt(b) : 0x20);
                    } else {
                        for (let b = 0; b < field.size; b++) this.emit((field.defaultValue.value >> (b * 8)) & 0xFF);
                    }
                } else {
                    for (let b = 0; b < field.size; b++) this.emit(0);
                }
            }
            return;
        }

        const result = InstructionEncoder.encode(line.instruction, line.operands, this.currentAddress, SymbolTable.toObject());
        if (!result) {
            if (line.operands.length === 0) {
                const labelName = line.instructionRaw || line.instruction;
                this.defineLabel(labelName, line.line, line.file);
                return;
            }
            const macroName2 = line.instructionRaw || line.instruction;
            if (Preprocessor.isMacro(macroName2)) {
                this.macroCount++;
                const expanded = Preprocessor.expandMacro(macroName2, line.operands, this.macroCount);
                if (expanded) {
                    for (const expandedLine of expanded) {
                        const parsed = Parser.parse(expandedLine, line.file || '<macro>')[0];
                        if (parsed) { parsed.file = line.file; parsed.line = line.line; this.processLine(parsed); }
                    }
                }
                return;
            }
            ErrorCollector.error(`Unknown instruction: ${macroName2}`, line.line, line.file);
            return;
        }
        
        if (result.bytes) {
            for (const byte of result.bytes) this.emit(byte);
        }
    },

    emit(byte) {
        const b = byte & 0xFF;
        const outputAddr = (this.physicalAddress !== null ? this.physicalAddress : this.currentAddress) & 0xFFFF;
        if (AsmMemory.device) AsmMemory.writeByte(outputAddr, b);
        if (outputAddr >= this.outputStart) {
            const offset = outputAddr - this.outputStart;
            while (this.output.length < offset) this.output.push(0);
            if (offset === this.output.length) this.output.push(b);
            else if (offset < this.output.length) this.output[offset] = b;
        }
        this.currentAddress++;
        this.currentAddress &= 0xFFFF;
        if (this.physicalAddress !== null) {
            this.physicalAddress++;
            this.physicalAddress &= 0xFFFF;
        }
    },

    evaluate(expr, line) {
        const tempMatch = /^(\d+)([BF])$/i.exec(expr);
        if (tempMatch) {
            const result = SymbolTable.parseTemp(expr, this.currentAddress, line.line);
            if (result) return result;
            return { value: 0, undefined: true };
        }
        return parseExpression(expr, SymbolTable.toObject(), this.currentAddress, this.sectionStart);
    }
};
