import {

  Controller, Get, Post, Patch, Delete,

  Body, Param, UseGuards, Request,

} from '@nestjs/common';

import { EmployeeService } from './employee.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from '../auth/roles.guard';

import { Roles } from '../auth/roles.decorator';

import { Role } from '../common/entities/user.entity';

import { CreateProgressDto } from './dto/create-progress.dto';

import { UpdateProgressDto } from './dto/update-progress.dto';

import { CreateCommentDto } from './dto/create-comment.dto';

import { UpdateCommentDto } from './dto/update-comment.dto';

import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
 
@Controller('employee')

@UseGuards(JwtAuthGuard, RolesGuard)

@Roles(Role.EMPLOYEE)

export class EmployeeController {

  constructor(private readonly employeeService: EmployeeService) {}
 
  // TASK ROUTES

  @Get('tasks')

  getAssignedTasks(@Request() req) {

    return this.employeeService.getAssignedTasks(req.user.id);

  }
 
  @Patch('tasks/:id/status')

  updateTaskStatus(

    @Param('id') id: string,

    @Body() updateTaskStatusDto: UpdateTaskStatusDto,

    @Request() req,

  ) {

    return this.employeeService.updateTaskStatus(id, updateTaskStatusDto, req.user.id);

  }
 
  // PROGRESS ROUTES

  @Post('progress')

  createProgress(@Body() createProgressDto: CreateProgressDto, @Request() req) {

    return this.employeeService.createProgress(createProgressDto, req.user);

  }
 
  @Get('progress')

  getMyProgress(@Request() req) {

    return this.employeeService.getMyProgress(req.user.id);

  }
 
  @Patch('progress/:id')

  updateProgress(

    @Param('id') id: string,

    @Body() updateProgressDto: UpdateProgressDto,

    @Request() req,

  ) {

    return this.employeeService.updateProgress(id, updateProgressDto, req.user.id);

  }
 
  @Delete('progress/:id')

  deleteProgress(@Param('id') id: string, @Request() req) {

    return this.employeeService.deleteProgress(id, req.user.id);

  }
 
  // COMMENT ROUTES

  @Post('comments')

  createComment(@Body() createCommentDto: CreateCommentDto, @Request() req) {

    return this.employeeService.createComment(createCommentDto, req.user);

  }
 
  @Get('comments/:taskId')

  getComments(@Param('taskId') taskId: string) {

    return this.employeeService.getCommentsByTask(taskId);

  }
 
  @Patch('comments/:id')

  updateComment(

    @Param('id') id: string,

    @Body() updateCommentDto: UpdateCommentDto,

    @Request() req,

  ) {

    return this.employeeService.updateComment(id, updateCommentDto, req.user.id);

  }
 
  @Delete('comments/:id')

  deleteComment(@Param('id') id: string, @Request() req) {

    return this.employeeService.deleteComment(id, req.user.id);

  }

}
 