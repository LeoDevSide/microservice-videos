import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsInstance,
} from 'class-validator'
import { ClassValidatorFields } from '../../../@shared/domain/validators/class-validator-fields'
import { GenreProps } from '../entities/genre.entity'
import { IterableNotEmpty, UniqueEntityId } from '../../../@shared/domain'
import { Distinct } from '../../../@shared/domain/validators/rules/distinct.rule'

export class GenreRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @IsBoolean()
  @IsOptional()
  isActive: boolean

  @IsDate()
  @IsOptional()
  createdAt: Date

  @Distinct((a: UniqueEntityId, b: UniqueEntityId) => a.value === b.value)
  @IsInstance(UniqueEntityId, { each: true })
  @IterableNotEmpty()
  categoriesId: Map<string, UniqueEntityId>

  constructor({ name, categoriesId, createdAt, isActive }: GenreProps) {
    Object.assign(this, { name, categoriesId, createdAt, isActive })
  }
}

export class GenreValidator extends ClassValidatorFields<GenreRules> {
  validate(props: GenreProps): boolean {
    const instanceToCheck = new GenreRules(props ?? ({} as any))

    return super.validate(instanceToCheck)
  }
}
// Anti-corruption
export default class GenreValidatorFactory {
  static create() {
    return new GenreValidator()
  }
}
