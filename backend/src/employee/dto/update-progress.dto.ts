import { IsString, IsOptional } from 'class-validator';
 
export class UpdateProgressDto {
  @IsOptional()
  @IsString()
  content?: string;
 
  @IsOptional()
  @IsString()
  statusRemark?: string;
}