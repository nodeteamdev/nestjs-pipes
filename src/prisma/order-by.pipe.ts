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
  ): Pipes.Order| undefined {
    if (value == null) return undefined;

    try {
      const rules = value.split(',').map((val) => val.trim());
      const orderBy: Pipes.Order = {};

      rules.forEach((rule) => {
        const [key, order] = rule.split(':') as [string, 'asc' | 'desc'];

        if (!['asc', 'desc'].includes(order.toLocaleLowerCase())) {
          throw new BadRequestException();
        }
        orderBy[key] = order.toLocaleLowerCase() as 'asc' | 'desc';
      });

      return orderBy;
    } catch (_) {
      throw new BadRequestException();
    }
  }
}
