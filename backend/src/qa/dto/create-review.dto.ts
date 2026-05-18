import { IsString, IsUUID, IsOptional } from 'class-validator';
 
export class CreateReviewDto {
  @IsString()
  notes: string;
 
  @IsOptional()
  @IsString()
  feedback?: string;
 
  @IsUUID()
  taskId: string;
}