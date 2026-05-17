import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards, Request
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // USER ROUTES
  @Post('users')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Patch('users/:id/password')
  resetPassword(@Param('id') id: string, @Body('password') password: string) {
    return this.adminService.resetPassword(id, password);
  }

  // TASK ROUTES
  @Post('tasks')
  createTask(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.adminService.createTask(createTaskDto, req.user);
  }

  @Get('tasks')
  getAllTasks() {
    return this.adminService.getAllTasks();
  }

  @Patch('tasks/:id')
  updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.adminService.updateTask(id, updateTaskDto);
  }

  @Delete('tasks/:id')
  deleteTask(@Param('id') id: string) {
    return this.adminService.deleteTask(id);
  }

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }
}