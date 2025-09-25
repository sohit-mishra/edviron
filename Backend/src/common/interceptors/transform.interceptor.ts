import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, { data: T; message: string }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ data: T; message: string }> {
    return next.handle().pipe(
      map((data) => ({
        message: 'Request successful',
        data,
      })),
    );
  }
}