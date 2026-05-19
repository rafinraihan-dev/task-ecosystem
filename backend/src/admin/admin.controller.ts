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
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // USER ROUTES
  @Post('users')
  @Roles(Role.ADMIN)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }

  @Get('users')
  @Roles(Role.ADMIN, Role.PROJECT_LEAD, Role.QA_TESTER)
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id')
  @Roles(Role.ADMIN)
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  @Roles(Role.ADMIN)
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Patch('users/:id/password')
  @Roles(Role.ADMIN)
  resetPassword(@Param('id') id: string, @Body('password') password: string) {
    return this.adminService.resetPassword(id, password);
  }

  // TASK ROUTES
  @Post('tasks')
  @Roles(Role.ADMIN)
  createTask(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.adminService.createTask(createTaskDto, req.user);
  }

  @Get('tasks')
  @Roles(Role.ADMIN, Role.QA_TESTER)
  getAllTasks() {
    return this.adminService.getAllTasks();
  }

  @Patch('tasks/:id')
  @Roles(Role.ADMIN)
  updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.adminService.updateTask(id, updateTaskDto);
  }

  @Delete('tasks/:id')
  @Roles(Role.ADMIN)
  deleteTask(@Param('id') id: string) {
    return this.adminService.deleteTask(id);
  }

  @Get('stats')
  @Roles(Role.ADMIN)
  getStats() {
    return this.adminService.getStats();
  }
}