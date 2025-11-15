import {
  Controller,
  Post,
  UseGuards,
  Param,
  Headers,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { RegistrationsService } from './registrations.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('competitions')
@UseGuards(JwtAuthGuard)
export class RegistrationsController {
  constructor(private registrationsService: RegistrationsService) {}

  @Post(':id/register')
  @UseGuards(RolesGuard)
  @Roles(Role.PARTICIPANT)
  @HttpCode(HttpStatus.CREATED)
  register(
    @Param('id') competitionId: string,
    @CurrentUser() user: any,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
     
    return this.registrationsService.register(user.id, competitionId, idempotencyKey);
  }
}
