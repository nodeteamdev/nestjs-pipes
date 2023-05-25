"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse_object_literal_1 = __importDefault(require("../../src/helpers/parse-object-literal"));
describe('parseObjectLiteral', () => {
    it('should parse a string with one key-value pair', () => {
        const input = 'a: 1';
        const expectedOutput = [['a', '1']];
        const actualOutput = (0, parse_object_literal_1.default)(input);
        expect(actualOutput).toEqual(expectedOutput);
    });
    it('should parse a string with multiple key-value pairs', () => {
        const input = 'a: 1, b: 2, c: 3';
        const expectedOutput = [['a', '1'], ['b', '2'], ['c', '3']];
        const actualOutput = (0, parse_object_literal_1.default)(input);
        expect(actualOutput).toEqual(expectedOutput);
    });
    it('should parse a string with a single-quoted value', () => {
        const input = 'a: \'1\'';
        const expectedOutput = [['a', '\'1\'']];
        const actualOutput = (0, parse_object_literal_1.default)(input);
        expect(actualOutput).toEqual(expectedOutput);
    });
    it('should parse a string with a double-quoted value', () => {
        const input = 'a: "1"';
        const expectedOutput = [['a', '"1"']];
        const actualOutput = (0, parse_object_literal_1.default)(input);
        expect(actualOutput).toEqual(expectedOutput);
    });
});
//# sourceMappingURL=parse-object-literal.spec.js.map