import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ReviewStatus } from '../../common/entities/review.entity';
 
export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  notes?: string;
 
  @IsOptional()
  @IsString()
  feedback?: string;
 
  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;
}