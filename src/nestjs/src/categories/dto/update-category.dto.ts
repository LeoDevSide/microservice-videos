import { IsString, IsOptional, IsBoolean } from 'class-validator'

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsBoolean()
  @IsOptional()
  is_active?: boolean
}
