import { Module } from '@nestjs/common';
import { RouterModule, APP_INTERCEPTOR } from '@nestjs/core';

import { RequestContextModule } from 'nestjs-request-context';
import { ConfigModule } from '@config/config.module';
import { ContextInterceptor } from '@shared/application/context/ContextInterceptor';

import routes from './http.routes';
import { CoreModule } from './core/core.module';

import { Logger } from './config/logger';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
];

@Module({
  imports: [RequestContextModule, ConfigModule, CoreModule, RouterModule.register(routes), Logger],
  providers: [...interceptors],
})
export class HttpModule {}
