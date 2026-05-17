import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { LeadService } from './lead.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('lead')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PROJECT_LEAD)
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  // TASK ROUTES
  @Post('tasks')
  createTask(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.leadService.createTask(createTaskDto, req.user);
  }

  @Get('tasks')
  getMyTasks(@Request() req) {
    return this.leadService.getMyTasks(req.user.id);
  }

  @Patch('tasks/:id')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    return this.leadService.updateTask(id, updateTaskDto, req.user.id);
  }

  @Delete('tasks/:id')
  deleteTask(@Param('id') id: string, @Request() req) {
    return this.leadService.deleteTask(id, req.user.id);
  }

  // COMMENT ROUTES
  @Post('comments')
  createComment(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.leadService.createComment(createCommentDto, req.user);
  }

  @Get('comments/:taskId')
  getComments(@Param('taskId') taskId: string) {
    return this.leadService.getCommentsByTask(taskId);
  }

  @Patch('comments/:id')
  updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ) {
    return this.leadService.updateComment(id, updateCommentDto, req.user.id);
  }

  @Delete('comments/:id')
  deleteComment(@Param('id') id: string, @Request() req) {
    return this.leadService.deleteComment(id, req.user.id);
  }
}