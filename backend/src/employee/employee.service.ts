import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../common/entities/task.entity';
import { Comment } from '../common/entities/comment.entity';
import { ProgressUpdate } from '../common/entities/progress-update.entity';
import { User } from '../common/entities/user.entity';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
 
@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(ProgressUpdate)
    private progressRepository: Repository<ProgressUpdate>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
 
  // TASK
  async getAssignedTasks(employeeId: string) {
    const employee = await this.userRepository.findOne({
      where: { id: employeeId },
    });
    if (!employee) throw new NotFoundException('Employee not found');
 
    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedEmployees', 'employee')
      .leftJoinAndSelect('task.createdBy', 'createdBy')
      .where('employee.id = :employeeId', { employeeId })
      .getMany();
 
    return tasks;
  }
 
  async updateTaskStatus(
    taskId: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    employeeId: string,
  ) {
    const tasks = await this.getAssignedTasks(employeeId);
    const task = tasks.find((t) => t.id === taskId);
    if (!task) throw new ForbiddenException('Task not assigned to you');
 
    task.status = updateTaskStatusDto.status;
    return this.taskRepository.save(task);
  }
 
  // PROGRESS UPDATES
  async createProgress(createProgressDto: CreateProgressDto, employee: User) {
    const task = await this.taskRepository.findOne({
      where: { id: createProgressDto.taskId },
    });
    if (!task) throw new NotFoundException('Task not found');
 
    const progress = this.progressRepository.create({
      content: createProgressDto.content,
      statusRemark: createProgressDto.statusRemark,
      employee,
      task,
    });
 
    return this.progressRepository.save(progress);
  }
 
  async getMyProgress(employeeId: string) {
    return this.progressRepository.find({
      where: { employee: { id: employeeId } },
    });
  }
 
  async updateProgress(
    id: string,
    updateProgressDto: UpdateProgressDto,
    employeeId: string,
  ) {
    const progress = await this.progressRepository.findOne({ where: { id } });
    if (!progress) throw new NotFoundException('Progress update not found');
    if (progress.employee.id !== employeeId)
      throw new ForbiddenException('You can only update your own progress');
 
    Object.assign(progress, updateProgressDto);
    return this.progressRepository.save(progress);
  }
 
  async deleteProgress(id: string, employeeId: string) {
    const progress = await this.progressRepository.findOne({ where: { id } });
    if (!progress) throw new NotFoundException('Progress update not found');
    if (progress.employee.id !== employeeId)
      throw new ForbiddenException('You can only delete your own progress');
 
    await this.progressRepository.remove(progress);
    return { message: 'Progress update deleted successfully' };
  }
 
  // COMMENTS
  async createComment(createCommentDto: CreateCommentDto, author: User) {
    const task = await this.taskRepository.findOne({
      where: { id: createCommentDto.taskId },
    });
    if (!task) throw new NotFoundException('Task not found');
 
    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      author,
      task,
    });
 
    return this.commentRepository.save(comment);
  }
 
  async getCommentsByTask(taskId: string) {
    return this.commentRepository.find({
      where: { task: { id: taskId } },
    });
  }
 
  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto,
    authorId: string,
  ) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.author.id !== authorId)
      throw new ForbiddenException('You can only edit your own comments');
 
    Object.assign(comment, updateCommentDto);
    return this.commentRepository.save(comment);
  }
 
  async deleteComment(id: string, authorId: string) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.author.id !== authorId)
      throw new ForbiddenException('You can only delete your own comments');
 
    await this.commentRepository.remove(comment);
    return { message: 'Comment deleted successfully' };
  }
}