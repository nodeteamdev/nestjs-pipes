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
const parseStringToInt = (ruleValue) => {
    if (!ruleValue.endsWith(')')) {
        return 0;
    }
    if (!ruleValue.startsWith('int(')) {
        return 0;
    }
    const arr = /\(([^)]+)\)/.exec(ruleValue);
    if (!arr || !arr[1]) {
        return 0;
    }
    return parseInt(arr[1], 10);
};
const parseStringToDate = (ruleValue) => {
    if (!ruleValue.endsWith(')')) {
        return '';
    }
    if (!ruleValue.startsWith('date(') && !ruleValue.startsWith('datetime(')) {
        return '';
    }
    const arr = /\(([^)]+)\)/.exec(ruleValue);
    if (!arr || !arr[1]) {
        return '';
    }
    return new Date(arr[1]).toISOString();
};
const parseStringToFloat = (ruleValue) => {
    if (!ruleValue.endsWith(')')) {
        return 0;
    }
    if (!ruleValue.startsWith('float(')) {
        return 0;
    }
    const arr = /\(([^)]+)\)/.exec(ruleValue);
    if (!arr || !arr[1]) {
        return 0;
    }
    return parseFloat(arr[1]);
};
const parseStringToString = (ruleValue) => {
    if (!ruleValue.endsWith(')')) {
        return '';
    }
    if (!ruleValue.startsWith('string(')) {
        return '';
    }
    const arr = /\(([^)]+)\)/.exec(ruleValue);
    if (!arr || !arr[1]) {
        return '';
    }
    return arr[1];
};
const parseStringToBoolean = (ruleValue) => {
    if (!ruleValue.endsWith(')')) {
        return false;
    }
    if (!ruleValue.startsWith('boolean(') && !ruleValue.startsWith('bool(')) {
        return false;
    }
    const arr = /\(([^)]+)\)/.exec(ruleValue);
    if (!arr || !arr[1]) {
        return false;
    }
    return arr[1] === 'true';
};
const parseValue = (ruleValue) => {
    if (ruleValue.startsWith('array(')) {
        const validRegExec = /\(([^]+)\)/.exec(ruleValue);
        if (validRegExec) {
            return validRegExec[1]
                .split(',')
                .map((value) => {
                switch (true) {
                    case value.startsWith('int('):
                        return parseStringToInt(value);
                    case value.startsWith('date(') || value.startsWith('datetime('):
                        return parseStringToDate(value);
                    case value.startsWith('float('):
                        return parseStringToFloat(value);
                    case value.startsWith('string('):
                        return parseStringToString(value);
                    case value.startsWith('boolean(') || value.startsWith('bool('):
                        return parseStringToBoolean(value);
                    default:
                        return value;
                }
            });
        }
    }
    switch (true) {
        case ruleValue.startsWith('int('):
            return parseStringToInt(ruleValue);
        case ruleValue.startsWith('date(') || ruleValue.startsWith('datetime('):
            return parseStringToDate(ruleValue);
        case ruleValue.startsWith('float('):
            return parseStringToFloat(ruleValue);
        case ruleValue.startsWith('string('):
            return parseStringToString(ruleValue);
        case ruleValue.startsWith('boolean(') || ruleValue.startsWith('bool('):
            return parseStringToBoolean(ruleValue);
        default:
            return ruleValue;
    }
};
let WherePipe = class WherePipe {
    transform(value) {
        if (value == null)
            return undefined;
        try {
            const rules = (0, parse_object_literal_1.default)(value);
            return this.buildCondition(rules);
        }
        catch (error) {
            console.error('Error parsing query string:', error);
            throw new common_1.BadRequestException('Invalid query format');
        }
    }
    buildCondition(rules) {
        const condition = {};
        const operations = this.getOperations();
        rules.forEach(([ruleKey, ruleValueRaw]) => {
            if (!ruleValueRaw)
                return;
            const ruleValue = parseValue(ruleValueRaw);
            const key = ruleKey.toUpperCase();
            if (key === 'OR' || key === 'AND') {
                const subConditions = ruleValueRaw
                    .slice(1, -1)
                    .split(',')
                    .map((cond) => (0, parse_object_literal_1.default)(cond.trim()))
                    .map((subRules) => this.buildCondition(subRules));
                condition[key] = subConditions;
            }
            else if (key === 'NOT') {
                const subRules = (0, parse_object_literal_1.default)(ruleValueRaw.trim());
                condition[key] = this.buildCondition(subRules);
            }
            else {
                let operation;
                for (const op of operations) {
                    if (ruleValueRaw.startsWith(`${op} `)) {
                        operation = op;
                        break;
                    }
                }
                if (operation) {
                    const parsedValue = parseValue(ruleValueRaw.replace(`${operation} `, ''));
                    if (ruleKey.includes('.')) {
                        const keys = ruleKey.split('.');
                        const parentKey = keys[0];
                        const subKey = keys.slice(1).join('.');
                        condition[parentKey] = condition[parentKey] || { is: {} };
                        condition[parentKey].is[subKey] = {
                            [operation]: parsedValue,
                        };
                    }
                    else {
                        condition[ruleKey] = {
                            [operation]: parsedValue,
                        };
                    }
                }
                else {
                    condition[ruleKey] = ruleValue;
                }
            }
        });
        return condition;
    }
    getOperations() {
        return [
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
            'in',
            'has',
            'hasEvery',
            'hasSome',
        ];
    }
};
WherePipe = __decorate([
    (0, common_1.Injectable)()
], WherePipe);
exports.default = WherePipe;
//# sourceMappingURL=where.pipe.js.map