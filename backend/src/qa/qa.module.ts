import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QaService } from './qa.service';
import { QaController } from './qa.controller';
import { Task } from '../common/entities/task.entity';
import { Review } from '../common/entities/review.entity';
import { BugReport } from '../common/entities/bug-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Review, BugReport])],
  controllers: [QaController],
  providers: [QaService],
})
export class QaModule {}