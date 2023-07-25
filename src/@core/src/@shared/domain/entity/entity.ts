import { UniqueEntityId } from '../value-objects/id.value-object'

export abstract class Entity<Props = any, JsonProps = any> {
  public readonly uniqueEntityId: UniqueEntityId

  constructor(public readonly props: Props, id?: UniqueEntityId) {
    this.uniqueEntityId = id ?? new UniqueEntityId()
  }

  get id(): string {
    return this.uniqueEntityId.value
  }

  abstract toJSON(): JsonProps
}
