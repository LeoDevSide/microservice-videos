import { UniqueEntityId } from '../../../@shared/domain'
import { CastMemberEntity, CastMemberType } from './cast-member.entity'
import { Faker, faker } from '@faker-js/faker'

export type PropOrFactory<T> = T | ((index: number) => T)

// builder pattern
// abstract constructor to high level layers
export class CastMemberFakeBuilder<TBuild = any> {
  private _name: PropOrFactory<string> = (_index) => this.faker.lorem.sentence()

  private _type: PropOrFactory<CastMemberType> = (_index) =>
    this.faker.number.int({ min: 1, max: 2 })

  // undefined due to entity generate it
  private _createdAt = undefined
  private _uniqueEntityId = undefined
  private faker: Faker
  private countObjs

  static aCastMember() {
    return new CastMemberFakeBuilder<CastMemberEntity>()
  }

  static theCategories(countObjs: number) {
    return new CastMemberFakeBuilder<CastMemberEntity[]>(countObjs)
  }

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs
    this.faker = faker
  }

  withEntityId(valueOrFactory: PropOrFactory<UniqueEntityId>) {
    this._uniqueEntityId = valueOrFactory
    return this
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory
    return this
  }

  withInvalidNameEmpty(value: '' | null | undefined) {
    this._name = value
    return this
  }

  withInvalidNameNotAString(value?: any) {
    this._name = value ?? 5
    return this
  }

  withInvalidNameTooLong(value?: string) {
    this._name = value ?? this.faker.string.alpha(256)
    return this
  }

  withType(valueOrFactory: PropOrFactory<CastMemberType>) {
    this._type = valueOrFactory
    return this
  }

  withInvalidTypeNotAsEnum(value?: any) {
    this._type = value ?? 3232
    return this
  }

  withInvalidTypeEmpty(value: '' | null | undefined) {
    this._type = value as any
    return this
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._createdAt = valueOrFactory
    return this
  }

  build(): TBuild {
    const categories = new Array(this.countObjs).fill(undefined).map(
      (_, index) =>
        new CastMemberEntity(
          {
            name: this.callFactory(this._name, index),
            type: this.callFactory(this._type, index),
            ...(this._createdAt && {
              createdAt: this.callFactory(this._createdAt, index),
            }),
          },
          !this._uniqueEntityId
            ? undefined
            : this.callFactory(this._uniqueEntityId, index),
        ),
    )
    return this.countObjs === 1 ? (categories[0] as any) : categories
  }

  get uniqueEntityId() {
    return this.getValue('uniqueEntityId')
  }

  get name() {
    return this.getValue('name')
  }

  get type() {
    return this.getValue('type')
  }

  get createdAt() {
    return this.getValue('createdAt')
  }

  private getValue(prop) {
    const optional = ['uniqueEntityId', 'createdAt']
    const privateProp = `_${prop}`
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(`Property ${prop} not have a factory, use 'with' methods`)
    }
    return this.callFactory(this[privateProp], 0)
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue
  }
}
