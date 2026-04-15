import {HttpException} from './http-exception';
import httpStatus from 'http-status';

export class UnprocessableEntityException extends HttpException {
  constructor(message = 'Unprocessable Entity') {
    super(message, httpStatus.UNPROCESSABLE_ENTITY as number);
    Object.setPrototypeOf(this, UnprocessableEntityException.prototype);
  }
}
