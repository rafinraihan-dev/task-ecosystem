import { IsString, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { BugSeverity } from '../../common/entities/bug-report.entity';
 
export class CreateBugDto {
  @IsString()
  title: string;
 
  @IsString()
  description: string;
 
  @IsOptional()
  @IsEnum(BugSeverity)
  severity?: BugSeverity;
 
  @IsOptional()
  @IsString()
  suggestedCorrection?: string;
 
  @IsUUID()
  taskId: string;
}