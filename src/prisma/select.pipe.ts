import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Pipes } from '../../index';

/**
 * OrderByPipe is a PipeTransform class that is used to transform a string into a Pipes.Select object.
 */
@Injectable()
export default class OrderByPipe implements PipeTransform {
  /**
   * Transforms a string into a Pipes.Select object.
   * @param value The string to be transformed.
   * @returns The Pipes.Select object created from the string.
   * @throws BadRequestException if the string is null or invalid.
   */
  transform(value: string): Pipes.Select | undefined {
    if (value == null) {
      return undefined;
    }

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
    } catch (error) {
      console.error(`Error transforming string to Pipes.Select: ${error}`);
      throw new BadRequestException('Invalid string format.');
    }
  }
}
