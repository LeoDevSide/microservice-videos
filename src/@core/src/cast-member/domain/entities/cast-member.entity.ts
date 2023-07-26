/* eslint-disable no-unused-vars */
import { UniqueEntityId } from '../../../@shared/domain'
import { Entity } from '../../../@shared/domain/entity/entity'
import { EntityValidationError } from '../../../@shared/domain/errors/validation.error'
import { CastMemberValidatorFactory } from '../validators/cast-member.validator'

// duplicate this enum in validator file to avoid TS enum circular dependency bug
export enum CastMemberType {
  DIRECTOR = 1,
  ACTOR = 2,
}

export type CastMemberProps = {
  name: string
  type: CastMemberType
  createdAt?: Date
}

export type CastMemberJsonProps = {
  id: string
  name: string
  type: CastMemberType
  created_at: Date
}
export class CastMemberEntity extends Entity<
  CastMemberProps,
  CastMemberJsonProps
> {
  constructor(public readonly props: CastMemberProps, id?: UniqueEntityId) {
    CastMemberEntity.validate(props)
    super(props, id)
    this.props.createdAt = props.createdAt ?? new Date()
  }

  get name() {
    return this.props.name
  }

  get type() {
    return this.props.type
  }

  get createdAt() {
    return this.props.createdAt
  }

  static validate(props: CastMemberProps) {
    const validator = CastMemberValidatorFactory.create()
    const isValid = validator.validate(props)
    if (!isValid) throw new EntityValidationError(validator.errors)
  }

  update(propsValues: { name: string; type: CastMemberType }) {
    CastMemberEntity.validate({
      name: propsValues.name,
      type: propsValues.type,
    })
    this.props.name = propsValues.name
    this.props.type = propsValues.type
  }

  toJSON(): CastMemberJsonProps {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      created_at: this.createdAt,
    }
  }
}
