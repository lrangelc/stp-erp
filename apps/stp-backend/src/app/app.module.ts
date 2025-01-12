import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PreAuthMiddleware } from '../auth/pre-auth-middleware';
import { FirebaseApp } from '../auth/firebase-app';

import {
  Business,
  BusinessUser,
  ExpenseRecord,
  LogCheckInOut,
  ProgressLog,
  Project,
  Status,
  User,
} from '@stp-erp/data';

import { BusinessUserModule } from '../business-user/business-user.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { ExpenseRecordModule } from '../expense-record/expense-record.module';
import { LogCheckInOutModule } from '../log-check-in-out/log-check-in-out.module';
import { ProgressLogModule } from '../progress-log/progress-log.module';
import { ProjectsModule } from '../projects/projects.module';
import { StatusModule } from '../status/status.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        Business,
        BusinessUser,
        ExpenseRecord,
        LogCheckInOut,
        ProgressLog,
        Project,
        Status,
        User,
      ],
      synchronize: false,
    }),
    BusinessUserModule,
    BusinessesModule,
    ExpenseRecordModule,
    LogCheckInOutModule,
    ProgressLogModule,
    ProjectsModule,
    StatusModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseApp],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(PreAuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
