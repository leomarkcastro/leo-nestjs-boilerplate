import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const path = context.switchToHttp().getRequest().url;
    return next
      .handle()
      .pipe(
        tap(() =>
          Logger.debug(`Request on path: ${path}: ${Date.now() - now}ms`),
        ),
      );
  }
}
