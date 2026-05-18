import { IsString, IsEnum, IsOptional } from 'class-validator';
import { BugSeverity, BugStatus } from '../../common/entities/bug-report.entity';
 
export class UpdateBugDto {
  @IsOptional()
  @IsString()
  title?: string;
 
  @IsOptional()
  @IsString()
  description?: string;
 
  @IsOptional()
  @IsEnum(BugSeverity)
  severity?: BugSeverity;
 
  @IsOptional()
  @IsEnum(BugStatus)
  status?: BugStatus;
 
  @IsOptional()
  @IsString()
  suggestedCorrection?: string;
}