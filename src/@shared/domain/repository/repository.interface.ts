import { Entity } from '../entity/entity'
import { UniqueEntityId } from '../value-objects/id.value-object'

export interface IRepository<E extends Entity> {
  insert(entity: E): Promise<void>
  findById(id: string | UniqueEntityId): Promise<E | null>
  findAll(): Promise<E[]>
  update(entity: E): Promise<void>
  delete(id: string | UniqueEntityId): Promise<void>
}
