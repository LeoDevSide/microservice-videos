/* eslint-disable no-unused-vars */
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { ClassValidatorFields } from '../../../@shared/domain/validators/class-validator-fields'
import { CastMemberProps } from '../entities/cast-member.entity'

// intentional enum duplication from entity due typescript convert enums to undefined in circular imports
enum CastMemberType {
  DIRECTOR = 1,
  ACTOR = 2,
}

export class CastMemberRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(CastMemberType)
  @IsNotEmpty()
  type: CastMemberType

  @IsDate()
  @IsOptional()
  createdAt: Date

  constructor({ name, type, createdAt }: CastMemberProps) {
    this.name = name
    this.type = type
    this.createdAt = createdAt
  }
}

export class CastMemberValidator extends ClassValidatorFields<CastMemberRules> {
  validate(props: CastMemberProps): boolean {
    const instanceToCheck = new CastMemberRules(props ?? ({} as any))

    return super.validate(instanceToCheck)
  }
}
// Anti-corruption
export class CastMemberValidatorFactory {
  static create() {
    return new CastMemberValidator()
  }
}
