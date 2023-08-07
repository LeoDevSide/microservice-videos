import {
  IsBoolean,
  IsString,
  IsArray,
  IsOptional,
  IsNotEmpty,
} from 'class-validator'

export class CreateGenreDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsBoolean()
  @IsOptional()
  is_active?: boolean

  @IsArray()
  @IsNotEmpty()
  categories_id: string[]
}
