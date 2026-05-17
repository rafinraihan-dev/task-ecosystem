import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../common/entities/user.entity';
import { Task } from '../common/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}