import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: 'The page number to fetch',
    minimum: 1,
    default: 1,
    type: Number,
  })
  @Type(() => Number)
  page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({
    description: 'The limit of items per page to fetch',
    minimum: 1,
    default: 10,
    maximum: 100,
    type: Number,
  })
  @Type(() => Number)
  limit: number;
}
