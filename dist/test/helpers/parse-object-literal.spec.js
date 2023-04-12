"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse_object_literal_1 = __importDefault(require("../../src/helpers/parse-object-literal"));
describe('parseObjectLiteral', () => {
    it('should parse a string like "a: 1, b: 2" to [["a", "1"], ["b", "2"]]', () => {
        const obj = 'a: 1, b: 2';
        const result = (0, parse_object_literal_1.default)(obj);
        expect(result).toEqual([['a', '1'], ['b', '2']]);
    });
    it('should be defined', () => {
        expect(parse_object_literal_1.default).toBeDefined();
    });
});
//# sourceMappingURL=parse-object-literal.spec.js.map