import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Task } from '../common/entities/task.entity';
import { Comment } from '../common/entities/comment.entity';
import { ProgressUpdate } from '../common/entities/progress-update.entity';
import { User } from '../common/entities/user.entity';
 
@Module({
  imports: [TypeOrmModule.forFeature([Task, Comment, ProgressUpdate, User])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}