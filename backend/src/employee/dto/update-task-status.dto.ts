import { IsEnum } from 'class-validator';
import { TaskStatus } from '../../common/entities/task.entity';
 
export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}