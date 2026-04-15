import {HttpException} from './http-exception';
import httpStatus from 'http-status';

export class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden') {
    super(message, httpStatus.FORBIDDEN as number);
    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }
}
