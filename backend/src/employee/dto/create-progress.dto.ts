import { IsString, IsUUID, IsOptional } from 'class-validator';
 
export class CreateProgressDto {
  @IsString()
  content: string;
 
  @IsOptional()
  @IsString()
  statusRemark?: string;
 
  @IsUUID()
  taskId: string;
}