// sjasmplus-js v0.10.19 - Z80 Assembler for ZX Spectrum
// Parser - Parses assembly source lines into structured form

import { ErrorCollector } from './errors';
import { TokenType, Lexer } from './lexer';

export const Parser = {
    tokens: [] as any[],
    pos: 0,
    line: 1,
    filename: '<input>',
    lineComments: {} as Record<number, string>,

    parse(source, filename = '<input>') {
        this.filename = filename;
        ErrorCollector.reset();
        
        if (!source) {
            return [];
        }
        
        const lexer = new Lexer(source, filename);
        this.tokens = lexer.tokenize();
        this.lineComments = lexer.lineComments || {};
        this.pos = 0;
        this.line = 1;

        const lines: any[] = [];
        while (!this.isAtEnd()) {
            const parsed = this.parseLine();
            if (parsed) {
                lines.push(parsed);
            }
        }
        return lines;
    },

    isAtEnd() {
        return this.pos >= this.tokens.length || 
               this.tokens[this.pos].type === TokenType.EOF;
    },

    peek(offset = 0) {
        const idx = this.pos + offset;
        return idx < this.tokens.length ? this.tokens[idx] : null;
    },

    advance() {
        if (!this.isAtEnd()) {
            const token = this.tokens[this.pos++];
            if (token.type === TokenType.NEWLINE) {
                this.line++;
            }
            return token;
        }
        return this.tokens[this.tokens.length - 1];
    },

    check(type) {
        const token = this.peek();
        return token && token.type === type;
    },

    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                return this.advance();
            }
        }
        return null;
    },

    parseLine() {
        if (this.match(TokenType.NEWLINE)) {
            return null;
        }

        const result = {
            line: this.line,
            file: this.filename,
            label: null as string | null,
            instruction: null as string | null,
            instructionRaw: null as string | null,
            directive: null as string | null,
            operands: [] as string[],
            raw: '',
            comment: this.lineComments[this.line] || ''
        };

        if (this.check(TokenType.IDENTIFIER) || this.check(TokenType.DOT)) {
            const labelStart = this.peek();
            
            if (this.match(TokenType.DOT)) {
                const name = this.match(TokenType.IDENTIFIER);
                if (name) {
                    result.label = '.' + name.value;
                }
            }
            else if (this.check(TokenType.IDENTIFIER)) {
                const identPos = this.pos;
                const ident = this.advance();
                const isAtLineStart = ident.column === 1;
                const identUpper = ident.value.toUpperCase();
                let putBack = false;
                
                const alwaysDirective = ['ENDM', 'ENDIF', 'ENDS', 'ENDR', 'ENDP', 'ENDMOD', 'ENDMODULE', 
                                        'EDUP', 'ENDT', 'ENDW', 'ELSE', 'ELSEIF'];
                
                if (alwaysDirective.includes(identUpper)) {
                    this.match(TokenType.COLON);
                    this.pos = identPos;
                    putBack = true;
                }
                else if (this.match(TokenType.COLON)) {
                    result.label = ident.value;
                }
                else if (this.check(TokenType.DOT)) {
                    const dotPos = this.pos;
                    this.advance();
                    let suffix = '';
                    
                    while (this.check(TokenType.NUMBER) || this.check(TokenType.IDENTIFIER) || this.check(TokenType.DOT)) {
                        const part = this.advance();
                        suffix += (part.type === TokenType.DOT ? '.' : part.value);
                    }
                    
                    if (suffix && this.match(TokenType.COLON)) {
                        result.label = ident.value + '.' + suffix;
                    } else {
                        this.pos = dotPos;
                        this.pos--;
                        putBack = true;
                    }
                }
                else if (this.check(TokenType.IDENTIFIER)) {
                    const next = this.peek().value.toUpperCase();
                    if (next === 'EQU' || next === 'DEFL' || next === 'MACRO') {
                        result.label = ident.value;
                    } 
                    else if (isAtLineStart && this.isDirective(identUpper) && !this.isInstruction(ident.value)) {
                        this.pos--;
                        putBack = true;
                    }
                    else if (isAtLineStart && !this.isInstruction(ident.value) && !this.isDirective(identUpper) && this.isInstruction(next)) {
                        result.label = ident.value;
                    }
                    else if (isAtLineStart && !this.isInstruction(ident.value) && !this.isDirective(identUpper) && this.isDirective(next)) {
                        result.label = ident.value;
                    }
                    else {
                        this.pos--;
                        putBack = true;
                    }
                }
                else if (this.check(TokenType.EQ)) {
                    result.label = ident.value;
                    this.advance();
                    result.directive = '=';
                    result.operands = this.parseOperands();
                    while (!this.check(TokenType.NEWLINE) && !this.isAtEnd()) {
                        this.advance();
                    }
                    this.match(TokenType.NEWLINE);
                    return result;
                }
                else if (isAtLineStart && this.isDirective(identUpper) && !this.isInstruction(ident.value) && 
                         (this.check(TokenType.NEWLINE) || this.isAtEnd())) {
                    const alwaysDirective = ['ENDM', 'ENDIF', 'ENDS', 'ENDR', 'ENDP', 'ENDMOD', 'ENDMODULE', 
                                            'EDUP', 'ENDT', 'ENDW', 'ELSE', 'ELSEIF'];
                    if (alwaysDirective.includes(identUpper)) {
                        this.pos--;
                        putBack = true;
                    } else {
                        result.label = ident.value;
                    }
                }
                else if (!putBack) {
                    this.pos--;
                }
            }
        }

        if (this.check(TokenType.NUMBER)) {
            const num = this.peek();
            if (this.peek(1) && this.peek(1).type === TokenType.COLON) {
                this.advance();
                this.advance();
                result.label = num.value.toString() + ':';
            }
        }

        if (this.check(TokenType.NEWLINE) || this.isAtEnd()) {
            this.match(TokenType.NEWLINE);
            return result.label ? result : null;
        }

        if (this.check(TokenType.IDENTIFIER)) {
            const ident = this.advance();
            const name = ident.value.toUpperCase();

            if (this.isDirective(name)) {
                result.directive = name;
            } else {
                result.instruction = name;
                result.instructionRaw = ident.value;
            }

            result.operands = this.parseOperands();
        }
        else if (this.check(TokenType.DOT)) {
            this.advance();
            if (this.check(TokenType.IDENTIFIER)) {
                const ident = this.advance();
                result.directive = '.' + ident.value.toUpperCase();
                result.operands = this.parseOperands();
            }
        }

        while (!this.check(TokenType.NEWLINE) && !this.check(TokenType.COLON) && !this.isAtEnd()) {
            this.advance();
        }
        if (this.check(TokenType.COLON)) {
            this.advance();
        } else {
            this.match(TokenType.NEWLINE);
        }

        return result;
    },

    parseOperands() {
        const operands: string[] = [];
        
        if (this.check(TokenType.NEWLINE) || this.isAtEnd()) {
            return operands;
        }

        operands.push(this.parseOperand());

        while (this.match(TokenType.COMMA)) {
            operands.push(this.parseOperand());
        }

        return operands;
    },

    parseOperand() {
        const tokens: any[] = [];
        let parenDepth = 0;

        while (!this.isAtEnd()) {
            const token = this.peek();
            
            if (token.type === TokenType.NEWLINE) break;
            if (token.type === TokenType.COMMA && parenDepth === 0) break;
            if (token.type === TokenType.COLON && parenDepth === 0) break;

            if (token.type === TokenType.LPAREN) parenDepth++;
            if (token.type === TokenType.RPAREN) parenDepth--;

            tokens.push(this.advance());
        }

        return this.tokensToString(tokens);
    },

    tokensToString(tokens) {
        let result = '';
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const prev = tokens[i - 1];

            if (prev && this.needsSpace(prev, token)) {
                result += ' ';
            }

            if (token.type === TokenType.STRING) {
                const val = token.value;
                if (val.includes('"') && !val.includes("'")) {
                    result += "'" + val + "'";
                } else {
                    result += '"' + val + '"';
                }
            } else if (token.type === TokenType.NUMBER) {
                result += token.value.toString();
            } else {
                result += token.value;
            }
        }
        return result.trim();
    },

    needsSpace(prev, curr) {
        if (prev.type === TokenType.LPAREN) return false;
        if (curr.type === TokenType.RPAREN) return false;
        if (curr.type === TokenType.COMMA) return false;
        if ((prev.type === TokenType.IDENTIFIER || prev.type === TokenType.NUMBER) &&
            (curr.type === TokenType.IDENTIFIER || curr.type === TokenType.NUMBER)) {
            return true;
        }
        if (prev.type === TokenType.IDENTIFIER && curr.type === TokenType.STRING) {
            return true;
        }
        return false;
    },

    isDirective(name) {
        const directives = [
            'DB', 'DW', 'DD', 'DQ', 'DEFB', 'DEFW', 'DEFD', 'DEFQ',
            'BYTE', 'WORD', 'DWORD', 'DS', 'DEFS', 'BLOCK',
            'DZ', 'DEFM', 'DM', 'DC', 'HEX',
            'ABYTE', 'ABYTEC', 'ABYTEZ',
            'ORG', 'ALIGN', 'PHASE', 'DEPHASE', 'DISP', 'ENT',
            'EQU', 'DEFL', 'LABEL', '=', 'DEFINE', 'UNDEFINE',
            'IF', 'IFDEF', 'IFNDEF', 'IFUSED', 'IFNUSED',
            'ELSE', 'ELSEIF', 'ENDIF',
            'MACRO', 'ENDM', 'ENDMACRO', 'EXITM',
            'REPT', 'ENDR', 'IRP', 'IRPC', 'DUP', 'EDUP',
            'STRUCT', 'ENDS', 'ENDSTRUCT',
            'MODULE', 'ENDMODULE',
            'INCLUDE', 'INCBIN',
            'OUTPUT', 'OUTEND',
            'SAVEBIN', 'SAVESNA', 'SAVETAP', 'EMPTYTAP', 'SAVETRD', 'EMPTYTRD',
            'DEVICE', 'SLOT', 'PAGE', 'MMU',
            'ASSERT', 'DISPLAY', 'SHELLEXEC',
            'OPT', 'CHARSET', 'ENCODING',
            'END',
            'LIST', 'NOLIST',
        ];
        return directives.includes(name) || name.startsWith('.');
    },

    isInstruction(name) {
        const instructions = [
            'LD', 'PUSH', 'POP',
            'ADD', 'ADC', 'SUB', 'SBC', 'AND', 'XOR', 'OR', 'CP',
            'INC', 'DEC',
            'DAA', 'CPL', 'NEG', 'CCF', 'SCF', 'NOP', 'HALT', 'DI', 'EI',
            'IM',
            'RLCA', 'RLA', 'RRCA', 'RRA',
            'RLC', 'RL', 'RRC', 'RR', 'SLA', 'SRA', 'SRL', 'SLL',
            'BIT', 'SET', 'RES',
            'JP', 'JR', 'DJNZ',
            'CALL', 'RET', 'RETI', 'RETN', 'RST',
            'IN', 'OUT', 'INI', 'INIR', 'IND', 'INDR',
            'OUTI', 'OTIR', 'OUTD', 'OTDR',
            'LDI', 'LDIR', 'LDD', 'LDDR',
            'CPI', 'CPIR', 'CPD', 'CPDR',
            'EX', 'EXX',
            'SLI', 'SWAP',
            'LDIX', 'LDIRX', 'LDDX', 'LDDRX', 'LDPIRX', 'LDIRSCALE',
            'OUTINB', 'MUL', 'MIRROR', 'NEXTREG', 'PIXELDN', 'PIXELAD',
            'SETAE', 'TEST', 'BSLA', 'BSRA', 'BSRL', 'BSRF', 'BRLC',
        ];
        return instructions.includes(name.toUpperCase());
    }
};

export const LineType = {
    INSTRUCTION: 'instruction',
    DIRECTIVE: 'directive',
    LABEL_ONLY: 'label_only',
    EMPTY: 'empty'
};

export function getLineType(parsed) {
    if (!parsed) return LineType.EMPTY;
    if (parsed.instruction) return LineType.INSTRUCTION;
    if (parsed.directive) return LineType.DIRECTIVE;
    if (parsed.label) return LineType.LABEL_ONLY;
    return LineType.EMPTY;
}
