import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;

    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';

    const excludePaths = [
      // Routes to be excluded
      //   '/user/profile',
    ];

    const currentPath = httpAdapter.getRequestUrl(request);

    if (
      !isGetRequest ||
      (isGetRequest &&
        excludePaths.includes(httpAdapter.getRequestUrl(request)))
    ) {
      return undefined;
    }

    const user = request.user;
    if (user) {
      return `${currentPath}/${user.id}`;
    }

    return currentPath;
  }
}
