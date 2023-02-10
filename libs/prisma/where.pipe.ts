import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import parseObjectLiteral from '../helpers/parse-object-literal';

const parseValue = (ruleValue: string) => {
  if (ruleValue.endsWith(')')) {
    if (ruleValue.startsWith('int(')) { // @ts-ignore
      return parseInt(/\(([^)]+)\)/.exec(ruleValue)[1], 10);
    }

    if (
      ruleValue.startsWith('date(') || ruleValue.startsWith('datetime(')
    ) { // @ts-ignore
      return new Date(/\(([^)]+)\)/.exec(ruleValue)[1]).toISOString();
    }

    if (ruleValue.startsWith('float(')) { // @ts-ignore
      return parseFloat(/\(([^)]+)\)/.exec(ruleValue)[1]);
    }

    if (ruleValue.startsWith('string(')) { // @ts-ignore
      return /\(([^)]+)\)/.exec(ruleValue)[1];
    }
    if (
      ruleValue.startsWith('boolean(') || ruleValue.startsWith('bool(')
    ) { // @ts-ignore
      return /\(([^)]+)\)/.exec(ruleValue)[1] === 'true';
    }
  }

  return ruleValue;
};
/**
 * @description Convert a string like
 * @example "id: int(1), firstName: banana" to { id: 1, firstName: "banana" }
 * */
@Injectable()
export default class WherePipe implements PipeTransform {
  transform(value: string): Record<string, any> | undefined {
    if (value == null) return undefined;
    try {
      const rules = parseObjectLiteral(value);
      const items: Record<string, any> = {};

      rules.forEach((rule: any) => {
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
            const data: Record<string, any> = {};

            data[val] = parseValue(ruleValue.replace(`${val} `, ''));

            if (
              typeof data[val] === 'string'
              && data[val].includes(':')
              && !data[val].endsWith(':')
              && !data[val].endsWith('Z')
            ) {
              const record: Record<string, any> = {};

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
    } catch (error) {
      throw new BadRequestException('Invalid query format');
    }
  }
}
