import httpStatus from 'http-status';
import {HttpException} from './http-exception';

export class NotFoundException extends HttpException {
  constructor(message: string = 'Resource not found') {
    super(message, httpStatus.NOT_FOUND);
  }
}
