import { Entity } from '../../../@shared/domain/entity/entity'
import { UniqueEntityId } from '../../../@shared/domain/value-objects/id.value-object'

export type CategoryProps = {
  name: string
  isActive?: boolean
  description?: string
  createdAt?: Date
}
export class CategoryEntity extends Entity<CategoryProps> {
  constructor(public readonly props: CategoryProps, id?: UniqueEntityId) {
    super(props, id)
    this.props.description = props.description ?? null
    this.props.isActive = props.isActive ?? true
    this.props.createdAt = props.createdAt ?? new Date()
  }

  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get createdAt() {
    return this.props.createdAt
  }

  get isActive() {
    return this.props.isActive
  }

  activate() {
    this.props.isActive = true
  }

  deactivate() {
    this.props.isActive = false
  }

  update(propsValues: { name: string; description: string }) {
    this.props.description = propsValues.description
    this.props.name = propsValues.name
  }
}
