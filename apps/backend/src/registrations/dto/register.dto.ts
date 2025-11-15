import { IsUUID } from 'class-validator';

export class RegisterDto {
  @IsUUID()
  competitionId: string;
}
