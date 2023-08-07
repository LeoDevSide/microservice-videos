import { IsBoolean, IsString, IsArray, IsOptional } from 'class-validator'
export class UpdateGenreDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsBoolean()
  @IsOptional()
  is_active?: boolean

  @IsArray()
  @IsOptional()
  categories_id?: string[]
}
