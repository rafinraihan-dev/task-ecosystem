import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

export enum BugSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum BugStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('bug_reports')
export class BugReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: BugSeverity, default: BugSeverity.MEDIUM })
  severity: BugSeverity;

  @Column({ type: 'enum', enum: BugStatus, default: BugStatus.OPEN })
  status: BugStatus;

  @Column({ type: 'text', nullable: true })
  suggestedCorrection: string;

  @ManyToOne(() => User, { eager: true })
  reporter: User;

  @ManyToOne(() => Task, { eager: true })
  task: Task;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}