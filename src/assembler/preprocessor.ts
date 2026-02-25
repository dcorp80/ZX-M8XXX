// sjasmplus-js v0.10.19 - Z80 Assembler for ZX Spectrum
// Preprocessor - Handles conditionals, macros, repeats, structs, includes

import { ErrorCollector } from './errors';
import { parseExpression } from './expression';

export const Preprocessor = {
    macros: {} as Record<string, any>,          // name -> { params, body, local }
    structs: {} as Record<string, any>,         // name -> { fields, size }
    structStack: [] as any[],     // For nested struct definitions
    charset: null as number[] | null,       // Character mapping table
    ifStack: [] as any[],         // Conditional nesting: { active, wasActive, inElse }
    repeatStack: [] as any[],     // REPT/DUP nesting
    
    reset() {
        Preprocessor.macros = {};
        Preprocessor.structs = {};
        Preprocessor.structStack = [];
        Preprocessor.charset = null;
        Preprocessor.ifStack = [];
        Preprocessor.repeatStack = [];
    },

    // ==================== Conditionals ====================

    isActive() {
        if (this.ifStack.length === 0) return true;
        return this.ifStack.every(frame => frame.active);
    },

    processIF(expr, symbols) {
        const parentActive = this.isActive();
        let active = false;
        
        if (parentActive) {
            const val = parseExpression(expr, symbols, 0, 0);
            active = val.value !== 0;
        }
        
        this.ifStack.push({ active, wasActive: active, inElse: false });
    },

    processIFDEF(symbol, symbols) {
        const parentActive = this.isActive();
        const active = parentActive && (symbol in symbols) && !symbols[symbol].undefined;
        this.ifStack.push({ active, wasActive: active, inElse: false });
    },

    processIFNDEF(symbol, symbols) {
        const parentActive = this.isActive();
        const active = parentActive && (!(symbol in symbols) || symbols[symbol].undefined);
        this.ifStack.push({ active, wasActive: active, inElse: false });
    },

    processIFUSED(symbol, symbols) {
        const parentActive = this.isActive();
        const sym = symbols[symbol];
        const active = parentActive && sym && sym.used;
        this.ifStack.push({ active, wasActive: active, inElse: false });
    },

    processIFNUSED(symbol, symbols) {
        const parentActive = this.isActive();
        const sym = symbols[symbol];
        const active = parentActive && (!sym || !sym.used);
        this.ifStack.push({ active, wasActive: active, inElse: false });
    },

    processELSE() {
        if (this.ifStack.length === 0) {
            ErrorCollector.error('ELSE without IF');
            return;
        }
        const frame = this.ifStack[this.ifStack.length - 1];
        if (frame.inElse) {
            ErrorCollector.error('Multiple ELSE clauses');
            return;
        }
        frame.inElse = true;
        const parentActive = this.ifStack.length === 1 || 
            this.ifStack.slice(0, -1).every(f => f.active);
        frame.active = parentActive && !frame.wasActive;
    },

    processELSEIF(expr, symbols) {
        if (this.ifStack.length === 0) {
            ErrorCollector.error('ELSEIF without IF');
            return;
        }
        const frame = this.ifStack[this.ifStack.length - 1];
        if (frame.inElse) {
            ErrorCollector.error('ELSEIF after ELSE');
            return;
        }
        
        const parentActive = this.ifStack.length === 1 || 
            this.ifStack.slice(0, -1).every(f => f.active);
        
        if (parentActive && !frame.wasActive) {
            const val = parseExpression(expr, symbols, 0, 0);
            frame.active = val.value !== 0;
            if (frame.active) frame.wasActive = true;
        } else {
            frame.active = false;
        }
    },

    processENDIF() {
        if (this.ifStack.length === 0) {
            ErrorCollector.error('ENDIF without IF');
            return;
        }
        this.ifStack.pop();
    },

    // ==================== Macros ====================

    defineMacro(name, params, body) {
        const key = name.toUpperCase();
        Preprocessor.macros[key] = {
            params: params,
            body: body,
            local: []
        };
    },

    isMacro(name) {
        const key = name.toUpperCase();
        return key in Preprocessor.macros;
    },

    expandMacro(name, args, macroCount) {
        const key = name.toUpperCase();
        const macro = Preprocessor.macros[key];
        if (!macro) return null;

        let body = macro.body.slice();
        const localPrefix = `__macro_${macroCount}_`;

        for (let i = 0; i < macro.params.length; i++) {
            const param = macro.params[i];
            const arg = args[i] !== undefined ? args[i] : '';
            const regex = new RegExp('\\b' + param + '\\b', 'gi');
            body = body.map(line => line.replace(regex, arg));
        }

        body = body.map(line => {
            line = line.replace(/\s*##\s*/g, '');
            return line;
        });

        body = body.map(line => {
            const result: { text: string; isString: boolean }[] = [];
            let inString = false;
            let stringChar = '';
            let current = '';
            
            for (let i = 0; i < line.length; i++) {
                const ch = line[i];
                if (!inString && (ch === '"' || ch === "'")) {
                    if (current) {
                        result.push({ text: current.replace(/\.(\w+)/g, `.${localPrefix}$1`), isString: false });
                        current = '';
                    }
                    inString = true;
                    stringChar = ch;
                    current = ch;
                } else if (inString && ch === stringChar) {
                    current += ch;
                    result.push({ text: current, isString: true });
                    current = '';
                    inString = false;
                } else {
                    current += ch;
                }
            }
            if (current) {
                if (inString) {
                    result.push({ text: current, isString: true });
                } else {
                    result.push({ text: current.replace(/\.(\w+)/g, `.${localPrefix}$1`), isString: false });
                }
            }
            
            return result.map(p => p.text).join('');
        });

        body = body.map(line => line.replace(/_NARG\b/g, args.length.toString()));

        return body;
    },

    // ==================== Repeats ====================

    startREPT(count) {
        this.repeatStack.push({
            type: 'REPT',
            count: count,
            body: [],
            collecting: true
        });
    },

    startDUP(count) {
        this.startREPT(count);
        this.repeatStack[this.repeatStack.length - 1].type = 'DUP';
    },

    endREPT() {
        if (this.repeatStack.length === 0) {
            ErrorCollector.error('ENDR/EDUP without REPT/DUP');
            return [];
        }
        const block = this.repeatStack.pop();
        const result: string[] = [];
        for (let i = 0; i < block.count; i++) {
            result.push(...block.body);
        }
        return result;
    },

    isCollectingRepeat() {
        return this.repeatStack.length > 0 && 
               this.repeatStack[this.repeatStack.length - 1].collecting;
    },

    addRepeatLine(line) {
        if (this.repeatStack.length > 0) {
            this.repeatStack[this.repeatStack.length - 1].body.push(line);
        }
    },

    // ==================== Structs ====================

    startSTRUCT(name) {
        this.structStack.push({
            name: name,
            fields: [],
            offset: 0
        });
    },

    addStructField(name, size, defaultValue) {
        if (this.structStack.length === 0) {
            ErrorCollector.error('Field outside STRUCT');
            return;
        }
        const struct = this.structStack[this.structStack.length - 1];
        struct.fields.push({
            name: name,
            offset: struct.offset,
            size: size,
            defaultValue: defaultValue
        });
        struct.offset += size;
    },

    endSTRUCT() {
        if (this.structStack.length === 0) {
            ErrorCollector.error('ENDS without STRUCT');
            return null;
        }
        const struct = this.structStack.pop();
        this.structs[struct.name] = {
            fields: struct.fields,
            size: struct.offset
        };
        return struct;
    },

    getSTRUCT(name) {
        return this.structs[name] || null;
    },

    inSTRUCT() {
        return this.structStack.length > 0;
    },

    // ==================== Character Set ====================

    setCHARSET(from, to, offset) {
        if (!this.charset) {
            this.charset = new Array(256);
            for (let i = 0; i < 256; i++) {
                this.charset[i] = i;
            }
        }

        if (typeof from === 'string' && typeof to === 'string') {
            const fromCode = from.charCodeAt(0);
            const toCode = to.charCodeAt(0);
            for (let i = fromCode; i <= toCode; i++) {
                this.charset[i] = offset + (i - fromCode);
            }
        } else if (typeof from === 'number') {
            this.charset[from] = to;
        }
    },

    applyCharset(str) {
        const result: number[] = [];
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (Preprocessor.charset && code < 256) {
                result.push(Preprocessor.charset[code]);
            } else {
                result.push(code);
            }
        }
        return result;
    },

    resetCHARSET() {
        this.charset = null;
    }
};
