import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../common/entities/task.entity';
import { Review } from '../common/entities/review.entity';
import { BugReport } from '../common/entities/bug-report.entity';
import { User } from '../common/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateBugDto } from './dto/create-bug.dto';
import { UpdateBugDto } from './dto/update-bug.dto';
import { ReviewStatus } from '../common/entities/review.entity';
 
@Injectable()
export class QaService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(BugReport)
    private bugRepository: Repository<BugReport>,
  ) {}
 
  // REVIEWS
  async createReview(createReviewDto: CreateReviewDto, reviewer: User) {
    const task = await this.taskRepository.findOne({
      where: { id: createReviewDto.taskId },
    });
    if (!task) throw new NotFoundException('Task not found');
 
    const review = this.reviewRepository.create({
      notes: createReviewDto.notes,
      feedback: createReviewDto.feedback,
      reviewer,
      task,
    });
 
    return this.reviewRepository.save(review);
  }
 
  async getAllReviews(reviewerId: string) {
    return this.reviewRepository.find({
      where: { reviewer: { id: reviewerId } },
    });
  }
 
  async updateReview(id: string, updateReviewDto: UpdateReviewDto, reviewerId: string) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.reviewer.id !== reviewerId)
      throw new ForbiddenException('You can only update your own reviews');
 
    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }
 
  async deleteReview(id: string, reviewerId: string) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.reviewer.id !== reviewerId)
      throw new ForbiddenException('You can only delete your own reviews');
 
    await this.reviewRepository.remove(review);
    return { message: 'Review deleted successfully' };
  }
 
  // BUG REPORTS
  async createBug(createBugDto: CreateBugDto, reporter: User) {
    const task = await this.taskRepository.findOne({
      where: { id: createBugDto.taskId },
    });
    if (!task) throw new NotFoundException('Task not found');
 
    const bug = this.bugRepository.create({
      title: createBugDto.title,
      description: createBugDto.description,
      severity: createBugDto.severity,
      suggestedCorrection: createBugDto.suggestedCorrection,
      reporter,
      task,
    });
 
    return this.bugRepository.save(bug);
  }
 
  async getAllBugs(reporterId: string) {
    return this.bugRepository.find({
      where: { reporter: { id: reporterId } },
    });
  }
 
  async updateBug(id: string, updateBugDto: UpdateBugDto, reporterId: string) {
    const bug = await this.bugRepository.findOne({ where: { id } });
    if (!bug) throw new NotFoundException('Bug report not found');
    if (bug.reporter.id !== reporterId)
      throw new ForbiddenException('You can only update your own bug reports');
 
    Object.assign(bug, updateBugDto);
    return this.bugRepository.save(bug);
  }
 
  async deleteBug(id: string, reporterId: string) {
    const bug = await this.bugRepository.findOne({ where: { id } });
    if (!bug) throw new NotFoundException('Bug report not found');
    if (bug.reporter.id !== reporterId)
      throw new ForbiddenException('You can only delete your own bug reports');
 
    await this.bugRepository.remove(bug);
    return { message: 'Bug report deleted successfully' };
  }
 
  // APPROVE / REJECT
  async approveTask(taskId: string) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    task.status = TaskStatus.COMPLETED;
    return this.taskRepository.save(task);
  }
 
  async rejectTask(taskId: string) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    task.status = TaskStatus.REJECTED;
    return this.taskRepository.save(task);
  }
}