"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const order_by_pipe_1 = __importDefault(require("../../src/prisma/order-by.pipe"));
describe('Order by pipe', () => {
    let pipe;
    beforeEach(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            providers: [order_by_pipe_1.default],
        }).compile();
        pipe = moduleRef.get(order_by_pipe_1.default);
    });
    it('should convert value like "name:asc, address:desc" to { name: "asc", address: "desc" }', () => {
        const value = 'name:asc, address:desc';
        const result = pipe.transform(value);
        expect(result).toEqual({
            address: 'desc',
            name: 'asc',
        });
    });
    it('should throw error if value is empty', () => {
        expect.assertions(1);
        const value = '';
        try {
            pipe.transform(value);
        }
        catch (e) {
            expect(e).toBeTruthy();
        }
    });
    it('should return values to lower case', () => {
        expect.assertions(1);
        const value = 'name:ASC, address:DESC';
        const result = pipe.transform(value);
        expect(result).toEqual({
            address: 'desc',
            name: 'asc',
        });
    });
    it('should throw an error if params not arc & desc', () => {
        const value = 'name:name, address:address';
        try {
            pipe.transform(value);
        }
        catch (e) {
            expect(e).toBeTruthy();
        }
    });
    it('should be defined', () => {
        expect(pipe).toBeDefined();
    });
});
//# sourceMappingURL=order-by-pipe.spec.js.map