import { UniqueEntityId } from '../../../@shared/domain'
import { GenreEntity } from './genre.entity'
import { Faker, faker } from '@faker-js/faker'

export type PropOrFactory<T> = T | ((index: number) => T)

// builder pattern
// abstract constructor to high level layers
export class GenreFakeBuilder<TBuild = any> {
  private _name: PropOrFactory<string> = (_index) => this.faker.lorem.sentence()

  private _isActive: PropOrFactory<boolean> = (_index) => true
  private _categoriesId: PropOrFactory<UniqueEntityId>[] = []
  // undefined due to entity generate it
  private _createdAt = undefined
  private _uniqueEntityId = undefined
  private faker: Faker
  private countObjs

  static aGenre() {
    return new GenreFakeBuilder<GenreEntity>()
  }

  static theGenres(countObjs: number) {
    return new GenreFakeBuilder<GenreEntity[]>(countObjs)
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

  withCategoryId(valueOrFactory: PropOrFactory<UniqueEntityId>) {
    this._categoriesId.push(valueOrFactory)
    return this
  }

  withCategoriesId(valueOrFactory?: PropOrFactory<UniqueEntityId>[]) {
    this._categoriesId = valueOrFactory
    return this
  }

  withInvalidCategoryId(value?: any) {
    this._categoriesId.push(value ?? ('any invalid id' as any))
    return this
  }

  activate() {
    this._isActive = true
    return this
  }

  deactivate() {
    this._isActive = false
    return this
  }

  withInvalidIsActiveEmpty(value: '' | null | undefined) {
    this._isActive = value as any
    return this
  }

  withInvalidIsActiveNotABoolean(value?: any) {
    this._isActive = value ?? 'fake boolean'
    return this
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._createdAt = valueOrFactory
    return this
  }

  build(): TBuild {
    const categories = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) =>
        GenreEntity.create(
          {
            name: this.callFactory(this._name, index),
            categoriesId: this.categoriesId.length
              ? this.categoriesId
              : [new UniqueEntityId(), new UniqueEntityId()],
            isActive: this.callFactory(this._isActive, index),
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

  get categoriesId() {
    return this.getValue('categoriesId')
  }

  get isActive() {
    return this.getValue('isActive')
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
