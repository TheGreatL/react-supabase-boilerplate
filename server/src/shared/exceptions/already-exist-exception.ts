import httpStatus from 'http-status';
import {HttpException} from './http-exception';

export class AlreadyExistException extends HttpException {
  constructor(message: string = 'Resource already exists') {
    super(message, httpStatus.CONFLICT);
  }
}
