import { PipeTransform } from '@nestjs/common';
import { Pipes } from '../../../index';
export default class OrderByPipe implements PipeTransform {
    transform(value: string): Pipes.Order | undefined;
}
