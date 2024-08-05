import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import parseObjectLiteral from '../helpers/parse-object-literal';
import { Pipes } from '../../index';

/**
 * @description Parse a string to an integer
 * @param {string} ruleValue - The string to be parsed
 * @returns {number} The parsed integer
 */
const parseStringToInt = (ruleValue: string): number => {
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

/**
 * @description Parse a string to a date
 * @param {string} ruleValue - The string to be parsed
 * @returns {string} The parsed date in ISO format
 */
const parseStringToDate = (ruleValue: string): string => {
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

/**
 * @description Parse a string to a float
 * @param {string} ruleValue - The string to be parsed
 * @returns {number} The parsed float
 */
const parseStringToFloat = (ruleValue: string): number => {
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

/**
 * @description Parse a string to a string
 * @param {string} ruleValue - The string to be parsed
 * @returns {string} The parsed string
 */
const parseStringToString = (ruleValue: string): string => {
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

/**
 * @description Parse a string to a boolean
 * @param {string} ruleValue - The string to be parsed
 * @returns {boolean} The parsed boolean
 */
const parseStringToBoolean = (ruleValue: string): boolean => {
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

/**
 * @description Parse a string to a value
 * @param {string} ruleValue - The string to be parsed
 * @returns {string | number | boolean | object} The parsed value
 */
const parseValue = (ruleValue: string): string | number | boolean | object => {
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

/**
 * @description Convert a string like
 * @example "id: int(1), firstName: banana" to { id: 1, firstName: "banana" }
 * */
@Injectable()
export default class WherePipe implements PipeTransform {
  transform(value: string) {
    if (value == null) return undefined;

    try {
      const rules = parseObjectLiteral(decodeURIComponent(value) || value);

      return this.buildCondition(rules);
    } catch (error) {
      console.error('Error parsing query string:', error);
      throw new BadRequestException('Invalid query format');
    }
  }

  private buildCondition(rules: [string, string | undefined][]): any {
    const condition: {
      [key: string]: any;
    } = {};
    const operations = [
      'lt',
      'lte',
      'gt',
      'gte',
      'equals',
      'not',
      'contains',
      'contains-insensitive',
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

    rules.forEach(([ruleKey, ruleValueRaw]) => {
      if (!ruleValueRaw) return;

      const ruleValue = parseValue(ruleValueRaw);
      const key = ruleKey.toUpperCase();

      if (key === 'AND' || key === 'OR' || key === 'NOT') {
        let subConditions;

        if (ruleValueRaw.startsWith('[') && ruleValueRaw.endsWith(']')) {
          subConditions = ruleValueRaw
            .slice(1, -1)
            .split(',')
            .map((cond) => parseObjectLiteral(cond.trim()))
            .map((subRules) => this.buildCondition(subRules));
        } else {
          const [subKey, subValue] = ruleValueRaw.split(':');
          const parsedSubRules: [string, string][] = [
            [subKey.trim(), subValue.trim()],
          ];

          subConditions = [this.buildCondition(parsedSubRules)];
        }

        if (key === 'NOT') {
          condition[key] =
            subConditions.length === 1 ? subConditions[0] : subConditions;
        } else {
          condition[key] = subConditions;
        }
      } else {
        let operation;

        for (const op of operations) {
          if (ruleValueRaw.startsWith(`${op} `)) {
            operation = op;
            break;
          }
        }

        if (operation) {
          const parsedValue = parseValue(
            ruleValueRaw.replace(`${operation} `, ''),
          );

          const keys = ruleKey.split('.');
          let currentLevel = condition;

          for (let i = 0; i < keys.length; i++) {
            const currentKey = keys[i];

            if (i > 0) {
              currentLevel['is'] = currentLevel['is'] || {};
              currentLevel = currentLevel['is'];
            }

            if (i !== keys.length - 1) {
              currentLevel[currentKey] = currentLevel[currentKey] || {};
              currentLevel = currentLevel[currentKey];
            }
          }

          const lastKey = keys[keys.length - 1];
          currentLevel[lastKey] = currentLevel[lastKey] || {};
          currentLevel[lastKey][operation] = parsedValue;
        } else {
          const keys = ruleKey.split('.');
          let currentLevel = condition;

          for (let i = 0; i < keys.length; i++) {
            const currentKey = keys[i];

            if (i > 0) {
              currentLevel['is'] = currentLevel['is'] || {};
              currentLevel = currentLevel['is'];
            }

            if (i !== keys.length - 1) {
              currentLevel[currentKey] = currentLevel?.[currentKey] || {};
              currentLevel = currentLevel[currentKey];
            }
          }

          const lastKey = keys[keys.length - 1];

          currentLevel[lastKey] = ruleValue;
        }
      }
    });

    return condition;
  }
}
