import {HttpException} from './http-exception';
import httpStatus from 'http-status';
export class BadRequestException extends HttpException {
  constructor(message: string = 'Bad request') {
    super(message, httpStatus.BAD_REQUEST);
  }
}
