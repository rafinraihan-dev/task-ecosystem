import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './common/entities/user.entity';
import { Task } from './common/entities/task.entity';
import { Comment } from './common/entities/comment.entity';
import { ProgressUpdate } from './common/entities/progress-update.entity';
import { Review } from './common/entities/review.entity';
import { BugReport } from './common/entities/bug-report.entity';
import { AdminModule } from './admin/admin.module';
import { LeadModule } from './lead/lead.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT') ?? '5432', 10),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Task, Comment, ProgressUpdate, Review, BugReport],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    AdminModule,
    LeadModule,
    EmployeeModule,
  ],
})
export class AppModule {}