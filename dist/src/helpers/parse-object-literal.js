"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseObjectLiteral = (objectLiteralString) => {
    try {
        const STRING_DOUBLE = '"(?:[^"\\\\]|\\\\.)*"';
        const STRING_SINGLE = "'(?:[^'\\\\]|\\\\.)*'";
        const STRING_REGEXP = '/(?:[^/\\\\]|\\\\.)*/w*';
        const SPECIAL_CHARACTERS = ',"\'{}()/:[\\]';
        const EVERYTHING_ELSE = `[^\\s:,/][^${SPECIAL_CHARACTERS}]*[^\\s${SPECIAL_CHARACTERS}]`;
        const ONE_NOT_SPACE = '[^\\s]';
        const TOKEN_REGEX = RegExp(`${STRING_DOUBLE}|${STRING_SINGLE}|${STRING_REGEXP}|${EVERYTHING_ELSE}|${ONE_NOT_SPACE}`, 'g');
        const DIVISION_LOOK_BEHIND = /[\])"'A-Za-z0-9_$]+$/;
        const KEYWORD_REGEX_LOOK_BEHIND = {
            in: 1,
            return: 1,
            typeof: 1,
        };
        let stringToParse = objectLiteralString.trim();
        if (stringToParse.charCodeAt(0) === 123)
            stringToParse = stringToParse.slice(1, -1);
        const result = [];
        let tokens = stringToParse.match(TOKEN_REGEX);
        if (!tokens)
            return result;
        let key;
        let values = [];
        let depth = 0;
        tokens.push(',');
        for (let i = 0, token; (token = tokens[i]); ++i) {
            const characterCode = token.charCodeAt(0);
            if (characterCode === 44) {
                if (depth <= 0) {
                    if (!key && values.length === 1) {
                        key = values.pop();
                    }
                    if (key)
                        result.push([key, values.length ? values.join('') : undefined]);
                    key = undefined;
                    values = [];
                    depth = 0;
                    continue;
                }
            }
            else if (characterCode === 58) {
                if (!depth && !key && values.length === 1) {
                    key = values.pop();
                    continue;
                }
            }
            else if (characterCode === 47 && i && token.length > 1) {
                const match = tokens[i - 1].match(DIVISION_LOOK_BEHIND);
                if (match && !KEYWORD_REGEX_LOOK_BEHIND[match[0]]) {
                    stringToParse = stringToParse.substr(stringToParse.indexOf(token) + 1);
                    const result = stringToParse.match(TOKEN_REGEX);
                    if (result)
                        tokens = result;
                    tokens.push(',');
                    i = -1;
                    token = '/';
                }
            }
            else if (characterCode === 40 || characterCode === 123 || characterCode === 91) {
                ++depth;
            }
            else if (characterCode === 41 || characterCode === 125 || characterCode === 93) {
                --depth;
            }
            else if (!key && !values.length && (characterCode === 34 || characterCode === 39)) {
                token = token.slice(1, -1);
            }
            values.push(token);
        }
        return result;
    }
    catch (error) {
        console.error('Error parsing object literal string', objectLiteralString, error);
        return [];
    }
};
exports.default = parseObjectLiteral;
//# sourceMappingURL=parse-object-literal.js.map