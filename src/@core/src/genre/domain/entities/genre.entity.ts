import { EntityValidationError, UniqueEntityId } from '../../../@shared/domain'
import { AggregateRoot } from '../../../@shared/domain/entity/aggregate-root'
import GenreValidatorFactory from '../validators/genre.validator'

export type GenreProps = {
  name: string
  isActive?: boolean
  createdAt?: Date

  categoriesId: Map<string, UniqueEntityId>
}

export type GenreCreateCommand = {
  name: string
  isActive?: boolean
  createdAt?: Date

  categoriesId: string[] | UniqueEntityId[]
}

export type GenreJsonProps = {
  id: string
  name: string
  is_active: boolean
  created_at: Date

  categories_id: string[]
}
export class GenreEntity extends AggregateRoot<GenreProps, GenreJsonProps> {
  private constructor(public readonly props: GenreProps, id?: UniqueEntityId) {
    GenreEntity.validate(props)
    super(props, id)
    this.props.isActive = props.isActive ?? true
    this.props.createdAt = props.createdAt ?? new Date()
  }

  static create(props: GenreCreateCommand, id?: UniqueEntityId): GenreEntity {
    const categoriesIdMap = new Map<string, UniqueEntityId>()
    props.categoriesId.forEach((categoryId) =>
      categoriesIdMap.set(
        categoryId instanceof UniqueEntityId ? categoryId.value : categoryId,
        categoryId instanceof UniqueEntityId
          ? categoryId
          : new UniqueEntityId(categoryId),
      ),
    )

    return new GenreEntity({ ...props, categoriesId: categoriesIdMap }, id)
  }

  static validate(props: GenreProps) {
    const validator = GenreValidatorFactory.create()
    const isValid = validator.validate(props)
    if (!isValid) throw new EntityValidationError(validator.errors)
  }

  activate() {
    this.props.isActive = true
  }

  deactivate() {
    this.props.isActive = false
  }

  update(propsValues: { name: string }) {
    GenreEntity.validate({
      ...this.props,
      name: propsValues.name,
    })
    this.props.name = propsValues.name
  }

  addCategoryId(categoryId: UniqueEntityId) {
    const categoriesId = new Map(this.categoriesId).set(
      categoryId.value,
      categoryId,
    )

    GenreEntity.validate({
      ...this.props,
      categoriesId,
    })

    this.categoriesId = categoriesId
  }

  removeCategoryId(categoryId: UniqueEntityId) {
    const categoriesId = new Map(this.categoriesId)
    categoriesId.delete(categoryId.value)

    GenreEntity.validate({
      ...this.props,
      categoriesId,
    })

    this.categoriesId = categoriesId
  }

  updateCategoriesId(newCategoriesId: UniqueEntityId[]) {
    if (!Array.isArray(newCategoriesId) || !newCategoriesId.length) {
      return
    }
    const categoriesIdMap = new Map<string, UniqueEntityId>()
    newCategoriesId.forEach((categoryId) =>
      categoriesIdMap.set(categoryId.value, categoryId),
    )
    GenreEntity.validate({
      ...this.props,
      categoriesId: categoriesIdMap,
    })
    this.categoriesId = categoriesIdMap
  }

  // --- serviria para rastrear adicionados e removidos ---
  // syncCategoriesId(newCategoriesId: UniqueEntityId[]) {
  //   if (!newCategoriesId.length) {
  //     return
  //   }
  //   this.categoriesId.forEach((categoryId) => {
  //     const notExists = !newCategoriesId.find((newCategoryId) =>
  //       newCategoryId.equals(categoryId),
  //     )
  //     if (notExists) this.categoriesId.delete(categoryId.value)
  //   })

  //   newCategoriesId.forEach((newCategoryId) =>
  //     this.categoriesId.set(newCategoryId.value, newCategoryId),
  //   )
  //   GenreEntity.validate({ ...this.props })
  // }

  get name() {
    return this.props.name
  }

  get createdAt() {
    return this.props.createdAt
  }

  get isActive() {
    return this.props.isActive
  }

  get categoriesId() {
    return this.props.categoriesId
  }

  private set categoriesId(value: Map<string, UniqueEntityId>) {
    this.props.categoriesId = value
  }

  toJSON(): GenreJsonProps {
    return {
      id: this.id,
      name: this.name,
      is_active: this.isActive,
      created_at: this.createdAt,
      categories_id: Array.from(this.categoriesId.values()).map(
        (categoryId) => categoryId.value,
      ),
    }
  }
}
