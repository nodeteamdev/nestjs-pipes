import { PipeTransform } from '@nestjs/common';
export default class WherePipe implements PipeTransform {
    transform(value: string): any;
    private isEmpty;
    private buildCondition;
}
