import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ApiModule } from './api/api.module';
import { RouterModule, Routes } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

const routes: Routes = [
  {
    path: 'api',
    module: ApiModule,
  },
];

const staticModules =
  process.env.NODE_ENV === 'production'
    ? [
        ServeStaticModule.forRoot({
          rootPath: join(process.cwd(), 'public'), // path to your static files - only in production
        }),
      ]
    : [];

@Module({
  imports: [
    RouterModule.register(routes),
    ...staticModules,
    CommonModule,
    ApiModule,
  ],
  providers: [],
})
export class AppModule {}
