import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface SuccessResponse<T> {
  success: true
  data: T
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
    )
  }
}
