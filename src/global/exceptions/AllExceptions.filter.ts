import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: exception,
    };

    console.log(exception);

    if (exception instanceof BadRequestException) {
      responseBody.message = exception.getResponse();
    } else if (exception instanceof HttpException) {
      responseBody.message = exception.message;
    } else if (exception instanceof PrismaClientKnownRequestError) {
      responseBody.message = { meta: exception.meta, issue: exception.code };
    } else if (exception instanceof PrismaClientValidationError) {
      responseBody.message = {
        meta: exception.message,
        issue: exception.stack,
      };
    } else if (exception instanceof Error) {
      Logger.error(exception);
      responseBody.message = exception.name;
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
