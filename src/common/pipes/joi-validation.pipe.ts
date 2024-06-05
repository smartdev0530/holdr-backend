import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      console.error(metadata.metatype, error);
      const errorMessages = error.details.reduce(
        (prev, current) => `${current.message}.`,
        '',
      );

      throw new BadRequestException(`Validation failed: ${errorMessages}`);
    }
    return value;
  }
}
