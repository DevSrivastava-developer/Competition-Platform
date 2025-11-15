import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CompetitionsService } from './competitions.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('competitions')
export class CompetitionsController {
  constructor(private competitionsService: CompetitionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER)
  create(@CurrentUser() user: any, @Body() createCompetitionDto: CreateCompetitionDto) {
    return this.competitionsService.create(user.id, createCompetitionDto);
  }

  @Get()
  findAll() {
    return this.competitionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.competitionsService.findOne(id);
  }
}
