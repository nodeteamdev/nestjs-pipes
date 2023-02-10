"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const parse_object_literal_1 = __importDefault(require("../helpers/parse-object-literal"));
const parseValue = (ruleValue) => {
    if (ruleValue.endsWith(')')) {
        if (ruleValue.startsWith('int(')) {
            const arr = /\(([^)]+)\)/.exec(ruleValue);
            if (arr && arr[1]) {
                return parseInt(arr[1], 10);
            }
        }
        if (ruleValue.startsWith('date(') || ruleValue.startsWith('datetime(')) {
            const arr = /\(([^)]+)\)/.exec(ruleValue);
            if (arr && arr[1]) {
                return new Date(arr[1]).toISOString();
            }
        }
        if (ruleValue.startsWith('float(')) {
            const arr = /\(([^)]+)\)/.exec(ruleValue);
            if (arr && arr[1]) {
                return parseFloat(arr[1]);
            }
        }
        if (ruleValue.startsWith('string(')) {
            const arr = /\(([^)]+)\)/.exec(ruleValue);
            if (arr && arr[1]) {
                return arr[1];
            }
        }
        if (ruleValue.startsWith('boolean(') || ruleValue.startsWith('bool(')) {
            const arr = /\(([^)]+)\)/.exec(ruleValue);
            if (arr && arr[1]) {
                return arr[1] === 'true';
            }
        }
    }
    return ruleValue;
};
let WherePipe = class WherePipe {
    transform(value) {
        if (value == null)
            return undefined;
        try {
            const rules = (0, parse_object_literal_1.default)(value);
            const items = {};
            rules.forEach((rule) => {
                const ruleKey = rule[0];
                const ruleValue = parseValue(rule[1]);
                [
                    'lt',
                    'lte',
                    'gt',
                    'gte',
                    'equals',
                    'not',
                    'contains',
                    'startsWith',
                    'endsWith',
                    'every',
                    'some',
                    'none',
                ].forEach((val) => {
                    if (rule[1].startsWith(`${val} `) && typeof ruleValue === 'string') {
                        const data = {};
                        data[val] = parseValue(ruleValue.replace(`${val} `, ''));
                        if (typeof data[val] === 'string'
                            && data[val].includes(':')
                            && !data[val].endsWith(':')
                            && !data[val].endsWith('Z')) {
                            const record = {};
                            record[data[val].split(':')[0].trim()] = data[val]
                                .split(':')[1]
                                .trim();
                            data[val] = record;
                        }
                        items[ruleKey] = data;
                    }
                });
                if (ruleValue != null && ruleValue !== '') {
                    items[ruleKey] = items[ruleKey] || ruleValue;
                }
            });
            return items;
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid query format');
        }
    }
};
WherePipe = __decorate([
    (0, common_1.Injectable)()
], WherePipe);
exports.default = WherePipe;
//# sourceMappingURL=where.pipe.js.map