"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const where_pipe_1 = __importDefault(require("../../src/prisma/where.pipe"));
describe('WherePipe', () => {
    let pipe;
    beforeEach(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            providers: [where_pipe_1.default],
        }).compile();
        pipe = moduleRef.get(where_pipe_1.default);
    });
    it('if transform value is empty pipe return empty json', () => {
        const result = pipe.transform('');
        expect(result).toEqual({});
    });
    it('if transform value is date should return parsed date', () => {
        const date = `date:${Date.now()}`;
        expect(pipe.transform(date)).toEqual({
            date: expect.any(String),
        });
    });
    it('if transform value is float should return parsed float', () => {
        const float = 'number: 0.0005';
        expect(pipe.transform(float)).toEqual({
            number: '0.0005',
        });
    });
    it('if transform value is string should return parsed string', () => {
        const user = 'userName: name';
        expect(pipe.transform(user)).toEqual({
            userName: 'name',
        });
    });
    it('if transform value is boolean should return parsed boolean', () => {
        const question = 'quest: true';
        expect(pipe.transform(question)).toEqual({
            quest: 'true',
        });
    });
    it('if transform value is integer should return parsed int', () => {
        const integer = 'number: 5';
        expect(pipe.transform(integer)).toEqual({
            number: '5',
        });
    });
    it('if transform value is array should return [in: array] ', () => {
        const string = 'zipCode: in array(int(111), int(222))';
        expect(pipe.transform(string)).toEqual({
            zipCode: {
                in: [111, 222]
            },
        });
    });
    it('should parse "has" from string "tags: has yellow"', () => {
        const string = 'tags: has yellow';
        expect(pipe.transform(string)).toEqual({
            tags: {
                has: "yellow",
            },
        });
    });
    it('should parse "hasEvery" from string "tags: hasEvery array(yellow, green)"', () => {
        const string = 'tags: hasEvery array(yellow, green)';
        expect(pipe.transform(string)).toEqual({
            tags: {
                hasEvery: ["yellow", "green"],
            },
        });
    });
    it('should parse "hasEvery" from string "numbers: hasEvery array(int(5), int(8))"', () => {
        const string = 'numbers: hasEvery array(int(5), int(8))';
        expect(pipe.transform(string)).toEqual({
            numbers: {
                hasEvery: [5, 8],
            },
        });
    });
    it('should parse "hasSome" from string "tags: hasSome array(yellow, green)"', () => {
        const string = 'tags: hasSome array(yellow, green)';
        expect(pipe.transform(string)).toEqual({
            tags: {
                hasSome: ["yellow", "green"],
            },
        });
    });
    it('should parse "." from string "product.details.color.hexadecimal: contains string(#FFFF)"', () => {
        const string = 'product.details.color.hexadecimal: contains string(#FFFF)';
        expect(pipe.transform(string)).toEqual({
            product: {
                is: {
                    details: {
                        is: {
                            color: {
                                is: {
                                    hexadecimal: {
                                        contains: "#FFFF"
                                    }
                                }
                            }
                        }
                    }
                }
            },
        });
    });
    it('should parse "OR" from string "OR:[ firstName: contains Jhon, lastName: contains Doe]"', () => {
        const string = "OR:[ firstName: contains Jhon, lastName: contains Doe]";
        expect(pipe.transform(string)).toEqual({
            OR: [
                { firstName: { contains: "Jhon" } },
                { lastName: { contains: "Doe" } },
            ],
        });
    });
    it('should parse "OR" with array values from string "OR:[id:in array(int(1),int(2),int(3)), user: contains Jhon]"', () => {
        const string = "OR:[id:in array(int(1),int(2),int(3)), user: contains Jhon]";
        expect(pipe.transform(string)).toEqual({
            OR: [
                {
                    id: {
                        in: [1, 2, 3]
                    }
                },
                {
                    user: {
                        contains: "Jhon"
                    }
                }
            ],
        });
    });
    it('should parse "OR and NOT" with "OR:[ email: contains super-admin@gmail.com, isVerified: equals boolean(true) ],  NOT: email: contains test@gmail.com"', () => {
        const string = "OR:[ email: contains super-admin@gmail.com, isVerified: equals boolean(true) ],  NOT: email: contains test@gmail.com";
        expect(pipe.transform(string)).toEqual({
            OR: [
                {
                    email: {
                        contains: "super-admin@gmail.com"
                    }
                },
                {
                    isVerified: {
                        equals: true
                    }
                }
            ],
            NOT: {
                email: {
                    contains: "test@gmail.com"
                }
            }
        });
    });
    it('should parse "AND and NOT" with "AND: [email: contains test@gmail.com], NOT: isVerified: equals boolean(false)"', () => {
        const string = "AND: [email: contains test@gmail.com], NOT: isVerified: equals boolean(false)";
        expect(pipe.transform(string)).toEqual({
            AND: [
                {
                    email: {
                        contains: "test@gmail.com"
                    }
                }
            ],
            NOT: {
                isVerified: {
                    equals: false
                }
            }
        });
    });
    it('should be defined', () => {
        expect(pipe).toBeDefined();
    });
});
//# sourceMappingURL=where.pipe.spec.js.map