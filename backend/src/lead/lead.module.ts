import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { Task } from '../common/entities/task.entity';
import { Comment } from '../common/entities/comment.entity';
import { User } from '../common/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Comment, User])],
  controllers: [LeadController],
  providers: [LeadService],
})
export class LeadModule {}