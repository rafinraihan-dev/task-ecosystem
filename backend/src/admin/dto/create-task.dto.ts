import { IsString, IsEnum, IsOptional, IsDateString, IsArray } from 'class-validator';
import { TaskPriority, TaskStatus } from '../../common/entities/task.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsArray()
  @IsOptional()
  assignedEmployeeIds?: string[];
}