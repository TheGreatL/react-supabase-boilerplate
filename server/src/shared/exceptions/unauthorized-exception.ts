import {HttpException} from './http-exception';
import httpStatus from 'http-status';

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized') {
    super(message, httpStatus.UNAUTHORIZED as number);
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}
