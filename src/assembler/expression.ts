// sjasmplus-js v0.10.19 - Z80 Assembler for ZX Spectrum
// Expression parser - Evaluates arithmetic, bitwise, logical expressions

import { ErrorCollector } from './errors';
import { TokenType, Lexer } from './lexer';
import { SymbolTable } from './labels';

export const ExpressionParser = {
    tokens: [] as any[],
    pos: 0,
    symbols: null as any,      // Symbol table for label resolution
    currentAddress: 0,  // $ value
    sectionStart: 0,    // $$ value

    // Parse and evaluate expression from tokens
    evaluate(tokens, symbols = {}, currentAddress = 0, sectionStart = 0) {
        this.tokens = tokens;
        this.pos = 0;
        this.symbols = symbols;
        this.currentAddress = currentAddress;
        this.sectionStart = sectionStart;

        if (tokens.length === 0) {
            return { value: 0, undefined: true };
        }

        const result = this.parseLogicalOr();
        
        return result;
    },

    peek(offset = 0) {
        const idx = this.pos + offset;
        return idx < this.tokens.length ? this.tokens[idx] : null;
    },

    advance() {
        return this.tokens[this.pos++];
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

    parseLogicalOr() {
        let result = this.parseLogicalAnd();

        while (this.match(TokenType.OR)) {
            const right = this.parseLogicalAnd();
            if (result.undefined || right.undefined) {
                result = { value: 0, undefined: true };
            } else {
                result = { value: (result.value || right.value) ? 1 : 0, undefined: false };
            }
        }

        return result;
    },

    parseLogicalAnd() {
        let result = this.parseBitwiseOr();

        while (this.match(TokenType.AND)) {
            const right = this.parseBitwiseOr();
            if (result.undefined || right.undefined) {
                result = { value: 0, undefined: true };
            } else {
                result = { value: (result.value && right.value) ? 1 : 0, undefined: false };
            }
        }

        return result;
    },

    parseBitwiseOr() {
        let result = this.parseBitwiseXor();

        while (this.match(TokenType.PIPE)) {
            const right = this.parseBitwiseXor();
            if (result.undefined || right.undefined) {
                result = { value: 0, undefined: true };
            } else {
                result = { value: (result.value | right.value) & 0xFFFFFFFF, undefined: false };
            }
        }

        return result;
    },

    parseBitwiseXor() {
        let result = this.parseBitwiseAnd();

        while (this.match(TokenType.CARET)) {
            const right = this.parseBitwiseAnd();
            if (result.undefined || right.undefined) {
                result = { value: 0, undefined: true };
            } else {
                result = { value: (result.value ^ right.value) & 0xFFFFFFFF, undefined: false };
            }
        }

        return result;
    },

    parseBitwiseAnd() {
        let result = this.parseEquality();

        while (this.match(TokenType.AMPERSAND)) {
            const right = this.parseEquality();
            if (result.undefined || right.undefined) {
                result = { value: 0, undefined: true };
            } else {
                result = { value: (result.value & right.value) & 0xFFFFFFFF, undefined: false };
            }
        }

        return result;
    },

    parseEquality() {
        let result = this.parseComparison();

        while (true) {
            if (this.match(TokenType.EQ)) {
                const right = this.parseComparison();
                if (result.undefined || right.undefined) {
                    result = { value: 0, undefined: true };
                } else {
                    result = { value: result.value === right.value ? 1 : 0, undefined: false };
                }
            } else if (this.match(TokenType.NE)) {
                const right = this.parseComparison();
                if (result.undefined || right.undefined) {
                    result = { value: 0, undefined: true };
                } else {
                    result = { value: result.value !== right.value ? 1 : 0, undefined: false };
                }
            } else {
                break;
            }
        }

        return result;
    },

    parseComparison() {
        let result = this.parseShift();

        while (true) {
            if (this.match(TokenType.LT)) {
                const right = this.parseShift();
                if (result.undefined || right.undefined) {
                    result = { value: 0, undefined: true };
                } else {
                    result = { value: result.value < right.value ? 1 : 0, undefined: false };
                }
            } else if (this.match(TokenType.GT)) {
                const right = this.parseShift();
                if (result.undefined || right.undefined) {
                    result = { value: 0, undefined: true };
                } else {
                    result = { value: result.value > right.value ? 1 : 0, undefined: false };
                }
            } else if (this.match(TokenType.LE)) {
                const right = this.parseShift();
                if (result.undefined || right.undefined) {
                    result = { value: 0, undefined: true };
                } else {
                    result = { value: result.value <= right.value ? 1 : 0, undefined: false };
                }
            } else if (this.match(TokenType.GE)) {
                const right = this.parseShift();
                if (result.undefined || right.undefined) {
                    result = { value: 0, undefined: true };
                } else {
                    result = { value: result.value >= right.value ? 1 : 0, undefined: false };
                }
            } else {
                break;
            }
        }

        return result;
    },

    parseShift() {
        let result = this.parseAdditive();

        while (true) {
            if (this.match(TokenType.LSHIFT)) {
                const right = this.parseAdditive();
                if (result.undefined || right.undefined) {
                    result = { value: 0, undefined: true };
                } else {
                    result = { value: (result.value << right.value) & 0xFFFFFFFF, undefined: false };
                }
            } else if (this.match(TokenType.RSHIFT)) {
                const right = this.parseAdditive();
                if (result.undefined || right.undefined) {
                    result = { value: 0, undefined: true };
                } else {
                    result = { value: result.value >>> right.value, undefined: false };
                }
            } else {
                break;
            }
        }

        return result;
    },

    parseAdditive() {
        let result = this.parseMultiplicative();

        while (true) {
            if (this.match(TokenType.PLUS)) {
                const right = this.parseMultiplicative();
                if (result.undefined || right.undefined) {
                    result = { value: 0, undefined: true };
                } else {
                    result = { value: (result.value + right.value) & 0xFFFFFFFF, undefined: false };
                }
            } else if (this.match(TokenType.MINUS)) {
                const right = this.parseMultiplicative();
                if (result.undefined || right.undefined) {
                    result = { value: 0, undefined: true };
                } else {
                    result = { value: (result.value - right.value) & 0xFFFFFFFF, undefined: false };
                }
            } else {
                break;
            }
        }

        return result;
    },

    parseMultiplicative() {
        let result = this.parseUnary();

        while (true) {
            if (this.match(TokenType.STAR)) {
                const right = this.parseUnary();
                if (result.undefined || right.undefined) {
                    result = { value: 0, undefined: true };
                } else {
                    result = { value: (result.value * right.value) & 0xFFFFFFFF, undefined: false };
                }
            } else if (this.match(TokenType.SLASH)) {
                const right = this.parseUnary();
                if (result.undefined || right.undefined) {
                    result = { value: 0, undefined: true };
                } else {
                    if (right.value === 0) {
                        ErrorCollector.error('Division by zero');
                    }
                    result = { value: Math.floor(result.value / right.value), undefined: false };
                }
            } else if (this.match(TokenType.PERCENT)) {
                const right = this.parseUnary();
                if (result.undefined || right.undefined) {
                    result = { value: 0, undefined: true };
                } else {
                    if (right.value === 0) {
                        ErrorCollector.error('Division by zero');
                    }
                    result = { value: result.value % right.value, undefined: false };
                }
            } else {
                break;
            }
        }

        return result;
    },

    parseUnary() {
        if (this.match(TokenType.PLUS)) {
            return this.parseUnary();
        }

        if (this.match(TokenType.MINUS)) {
            const result = this.parseUnary();
            if (result.undefined) {
                return { value: 0, undefined: true };
            }
            return { value: (-result.value) & 0xFFFFFFFF, undefined: false };
        }

        if (this.match(TokenType.TILDE)) {
            const result = this.parseUnary();
            if (result.undefined) {
                return { value: 0, undefined: true };
            }
            return { value: (~result.value) & 0xFFFFFFFF, undefined: false };
        }

        if (this.match(TokenType.BANG)) {
            const result = this.parseUnary();
            if (result.undefined) {
                return { value: 0, undefined: true };
            }
            return { value: result.value === 0 ? 1 : 0, undefined: false };
        }

        const token = this.peek();
        if (token && token.type === TokenType.IDENTIFIER) {
            const name = token.value.toUpperCase();
            if (name === 'HIGH' || name === 'LOW' || name === 'NOT' || 
                name === 'ABS' || name === 'DEFINED') {
                this.advance();
                
                const hasParen = this.match(TokenType.LPAREN);
                
                const arg = hasParen ? this.parseLogicalOr() : this.parseUnary();
                
                if (hasParen && !this.match(TokenType.RPAREN)) {
                    ErrorCollector.error(`Expected ')' after ${name} argument`);
                }

                if (name === 'DEFINED') {
                    return { value: arg.undefined ? 0 : 1, undefined: false };
                }

                if (arg.undefined) {
                    return { value: 0, undefined: true };
                }

                switch (name) {
                    case 'HIGH':
                        return { value: (arg.value >> 8) & 0xFF, undefined: false };
                    case 'LOW':
                        return { value: arg.value & 0xFF, undefined: false };
                    case 'NOT':
                        return { value: arg.value === 0 ? 1 : 0, undefined: false };
                    case 'ABS':
                        return { value: Math.abs(arg.value), undefined: false };
                }
            }
        }

        return this.parsePrimary();
    },

    parsePrimary() {
        if (this.match(TokenType.LPAREN)) {
            const result = this.parseLogicalOr();
            if (!this.match(TokenType.RPAREN)) {
                ErrorCollector.error("Expected ')'");
            }
            return result;
        }

        if (this.check(TokenType.NUMBER)) {
            const token = this.advance();
            return { value: token.value, undefined: false };
        }

        if (this.check(TokenType.STRING)) {
            const token = this.advance();
            const str = token.value;
            let value = 0;
            for (let i = 0; i < str.length && i < 4; i++) {
                value = (value << 8) | str.charCodeAt(i);
            }
            return { value, undefined: false };
        }

        if (this.match(TokenType.DOLLAR)) {
            return { value: this.currentAddress, undefined: false };
        }

        if (this.check(TokenType.IDENTIFIER)) {
            const token = this.advance();
            let name = token.value;

            while (this.match(TokenType.DOT)) {
                if (this.check(TokenType.IDENTIFIER)) {
                    name += '.' + this.advance().value;
                } else if (this.check(TokenType.NUMBER)) {
                    name += '.' + this.advance().value;
                } else {
                    break;
                }
            }

            if (name === '$$') {
                return { value: this.sectionStart, undefined: false };
            }

            const tempMatch = /^(\d+)([BF])$/i.exec(name);
            if (tempMatch) {
                const result = SymbolTable.parseTemp(name, this.currentAddress, token.line);
                if (result) {
                    return result;
                }
                return { value: 0, undefined: true };
            }

            if (this.symbols && name in this.symbols) {
                const sym = this.symbols[name];
                if (SymbolTable.symbols && SymbolTable.symbols[name]) {
                    SymbolTable.symbols[name].used = true;
                }
                if (typeof sym === 'object') {
                    return { value: sym.value, undefined: sym.undefined || false };
                }
                return { value: sym, undefined: false };
            }

            if (name.startsWith('.') && SymbolTable.localPrefix) {
                const fullName = SymbolTable.localPrefix + name;
                if (this.symbols && fullName in this.symbols) {
                    const sym = this.symbols[fullName];
                    if (SymbolTable.symbols && SymbolTable.symbols[fullName]) {
                        SymbolTable.symbols[fullName].used = true;
                    }
                    if (typeof sym === 'object') {
                        return { value: sym.value, undefined: sym.undefined || false };
                    }
                    return { value: sym, undefined: false };
                }
            }

            return { value: 0, undefined: true, symbol: name };
        }

        const token = this.peek();
        if (token) {
            ErrorCollector.error(`Unexpected token: ${token.type} (${token.value})`);
        }
        
        return { value: 0, undefined: true };
    }
};

export function parseExpression(source, symbols = {}, currentAddress = 0, sectionStart = 0) {
    ErrorCollector.reset();
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize().filter(t => 
        t.type !== TokenType.NEWLINE && t.type !== TokenType.EOF
    );
    return ExpressionParser.evaluate(tokens, symbols, currentAddress, sectionStart);
}
