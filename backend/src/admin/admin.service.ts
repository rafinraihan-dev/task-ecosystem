import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../common/entities/user.entity';
import { Task } from '../common/entities/task.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  // USER MANAGEMENT
  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const saved = await this.userRepository.save(user);
    const { password, ...result } = saved;
    return result;
  }

  async getAllUsers() {
    const users = await this.userRepository.find();
    return users.map(({ password, ...rest }) => rest);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, updateUserDto);
    const saved = await this.userRepository.save(user);
    const { password, ...result } = saved;
    return result;
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

  async resetPassword(id: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
    return { message: 'Password reset successfully' };
  }

  // TASK MANAGEMENT
  async createTask(createTaskDto: CreateTaskDto, adminUser: User) {
    const { assignedEmployeeIds, deadline, ...taskData } = createTaskDto;

    const task = this.taskRepository.create({
      ...taskData,
      deadline: deadline ? new Date(deadline) : undefined,
      createdBy: adminUser,
    });

    if (assignedEmployeeIds && assignedEmployeeIds.length > 0) {
      const employees = await this.userRepository.findByIds(assignedEmployeeIds);
      task.assignedEmployees = employees;
    }

    return this.taskRepository.save(task);
  }

  async getAllTasks() {
    return this.taskRepository.find();
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    const { assignedEmployeeIds, deadline, ...taskData } = updateTaskDto;
    Object.assign(task, taskData);

    if (deadline) task.deadline = new Date(deadline);

    if (assignedEmployeeIds) {
      const employees = await this.userRepository.findByIds(assignedEmployeeIds);
      task.assignedEmployees = employees;
    }

    return this.taskRepository.save(task);
  }

  async deleteTask(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    await this.taskRepository.remove(task);
    return { message: 'Task deleted successfully' };
  }

  async getStats() {
    const totalUsers = await this.userRepository.count();
    const totalTasks = await this.taskRepository.count();
    return { totalUsers, totalTasks };
  }
}