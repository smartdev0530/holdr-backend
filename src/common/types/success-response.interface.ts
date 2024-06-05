import { HttpStatus } from '@nestjs/common';

export interface ISuccessResponse<T = any> {
  isSuccess: boolean;
  message: string;
  statusCode?: HttpStatus;
  data?: T;
}
