import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../common/entities/task.entity';
import { Comment } from '../common/entities/comment.entity';
import { User } from '../common/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // TASK MANAGEMENT
  async createTask(createTaskDto: CreateTaskDto, lead: User) {
    const { assignedEmployeeIds, deadline, ...taskData } = createTaskDto;

    const task = this.taskRepository.create({
      ...taskData,
      deadline: deadline ? new Date(deadline) : undefined,
      createdBy: lead,
    });

    if (assignedEmployeeIds && assignedEmployeeIds.length > 0) {
      const employees = await this.userRepository.findByIds(assignedEmployeeIds);
      task.assignedEmployees = employees;
    }

    return this.taskRepository.save(task);
  }

  async getMyTasks(leadId: string) {
    return this.taskRepository.find({
      where: { createdBy: { id: leadId } },
    });
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto, leadId: string) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.createdBy.id !== leadId)
      throw new ForbiddenException('You can only update your own tasks');

    const { assignedEmployeeIds, deadline, ...taskData } = updateTaskDto;
    Object.assign(task, taskData);

    if (deadline) task.deadline = new Date(deadline);

    if (assignedEmployeeIds) {
      const employees = await this.userRepository.findByIds(assignedEmployeeIds);
      task.assignedEmployees = employees;
    }

    return this.taskRepository.save(task);
  }

  async deleteTask(id: string, leadId: string) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.createdBy.id !== leadId)
      throw new ForbiddenException('You can only delete your own tasks');
    await this.taskRepository.remove(task);
    return { message: 'Task deleted successfully' };
  }

  // COMMENT MANAGEMENT
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

  async updateComment(id: string, updateCommentDto: UpdateCommentDto, authorId: string) {
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