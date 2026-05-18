import {

  Controller, Get, Post, Patch, Delete,

  Body, Param, UseGuards, Request,

} from '@nestjs/common';

import { QaService } from './qa.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from '../auth/roles.guard';

import { Roles } from '../auth/roles.decorator';

import { Role } from '../common/entities/user.entity';

import { CreateReviewDto } from './dto/create-review.dto';

import { UpdateReviewDto } from './dto/update-review.dto';

import { CreateBugDto } from './dto/create-bug.dto';

import { UpdateBugDto } from './dto/update-bug.dto';
 
@Controller('qa')

@UseGuards(JwtAuthGuard, RolesGuard)

@Roles(Role.QA_TESTER)

export class QaController {

  constructor(private readonly qaService: QaService) {}
 
  // REVIEW ROUTES

  @Post('reviews')

  createReview(@Body() createReviewDto: CreateReviewDto, @Request() req) {

    return this.qaService.createReview(createReviewDto, req.user);

  }
 
  @Get('reviews')

  getAllReviews(@Request() req) {

    return this.qaService.getAllReviews(req.user.id);

  }
 
  @Patch('reviews/:id')

  updateReview(

    @Param('id') id: string,

    @Body() updateReviewDto: UpdateReviewDto,

    @Request() req,

  ) {

    return this.qaService.updateReview(id, updateReviewDto, req.user.id);

  }
 
  @Delete('reviews/:id')

  deleteReview(@Param('id') id: string, @Request() req) {

    return this.qaService.deleteReview(id, req.user.id);

  }
 
  // BUG REPORT ROUTES

  @Post('bugs')

  createBug(@Body() createBugDto: CreateBugDto, @Request() req) {

    return this.qaService.createBug(createBugDto, req.user);

  }
 
  @Get('bugs')

  getAllBugs(@Request() req) {

    return this.qaService.getAllBugs(req.user.id);

  }
 
  @Patch('bugs/:id')

  updateBug(

    @Param('id') id: string,

    @Body() updateBugDto: UpdateBugDto,

    @Request() req,

  ) {

    return this.qaService.updateBug(id, updateBugDto, req.user.id);

  }
 
  @Delete('bugs/:id')

  deleteBug(@Param('id') id: string, @Request() req) {

    return this.qaService.deleteBug(id, req.user.id);

  }
 
  // APPROVE / REJECT ROUTES

  @Patch('tasks/:id/approve')

  approveTask(@Param('id') id: string) {

    return this.qaService.approveTask(id);

  }
 
  @Patch('tasks/:id/reject')

  rejectTask(@Param('id') id: string) {

    return this.qaService.rejectTask(id);

  }

}
 