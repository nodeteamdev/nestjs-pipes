import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Pipes } from '../../index';

@Injectable()
export default class OrderByPipe implements PipeTransform {
  transform(
    value: string,
  ): Pipes.Select| undefined {
    if (value == null) return undefined;

    try {
      const selectFields = value.split(',').map((val) => val.trim());
      const select: Pipes.Select = {};

      selectFields.forEach((field) => {
        if (field.startsWith('-')) {
          select[field.replace('-', '')] = false;
        } else {
          select[field] = true;
        }
      });

      return select;
    } catch (_) {
      throw new BadRequestException();
    }
  }
}
