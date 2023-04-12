"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const select_pipe_1 = __importDefault(require("../../src/prisma/select.pipe"));
describe('SelectPipe', () => {
    let pipe;
    beforeEach(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            providers: [select_pipe_1.default],
        }).compile();
        pipe = moduleRef.get(select_pipe_1.default);
    });
    it('should transform string -user like { user:false }', () => {
        const value = '-user';
        const result = pipe.transform(value);
        expect(result).toEqual({
            user: false,
        });
    });
    it('should transform string user like { user:true }', () => {
        const value = 'user';
        const result = pipe.transform(value);
        expect(result).toEqual({
            user: true,
        });
    });
    it('should be defined', () => {
        expect(pipe).toBeDefined();
    });
});
//# sourceMappingURL=select.pipe.spec.js.map