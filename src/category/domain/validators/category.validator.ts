import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { ClassValidatorFields } from '../../../@shared/domain/validators/class-validator-fields'
import { CategoryProps } from '../entities/category.entity'

export class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsBoolean()
  @IsOptional()
  isActive: boolean

  @IsDate()
  @IsOptional()
  createdAt: Date

  constructor({ name, description, createdAt, isActive }: CategoryProps) {
    Object.assign(this, { name, description, createdAt, isActive })
  }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(data: CategoryProps): boolean {
    return super.validate(new CategoryRules(data ?? ({} as any)))
  }
}
// Anti-corruption
export default class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator()
  }
}
