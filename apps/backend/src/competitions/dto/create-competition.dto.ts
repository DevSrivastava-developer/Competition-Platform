import { IsString, IsOptional, IsInt, Min, IsDateString, IsArray } from 'class-validator';

export class CreateCompetitionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsInt()
  @Min(1)
  capacity: number;

  @IsDateString()
  regDeadline: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;
}
