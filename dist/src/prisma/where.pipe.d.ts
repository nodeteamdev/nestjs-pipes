import { PipeTransform } from '@nestjs/common';
import { Pipes } from '../../../index';
export default class WherePipe implements PipeTransform {
    transform(value: string): Pipes.Where | undefined;
}
