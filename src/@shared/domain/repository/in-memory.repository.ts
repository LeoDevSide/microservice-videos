import { Entity } from '../entity/entity'
import { NotFoundError } from '../errors/not-found.error'
import { UniqueEntityId } from '../value-objects/id.value-object'
import { IRepository } from './repository.interface'

export default abstract class InMemoryRepository<E extends Entity>
  implements IRepository<E>
{
  items: E[] = []

  async insert(entity: E): Promise<void> {
    this.items.push(entity)
  }

  async findById(id: string | UniqueEntityId): Promise<E | null> {
    const _id = `${id}`
    const foundItem = this._get(_id)
    if (!foundItem) {
      return null
    }
    return foundItem
  }

  async findAll(): Promise<E[]> {
    return this.items
  }

  async update(entity: E): Promise<void> {
    await this._get(entity.id)

    const indexFound = this.items.findIndex((item) => item.id === entity.id)
    // findIndex returns -1 when not found
    if (indexFound >= 0) {
      this.items[indexFound] = entity
    }
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    const _id = `${id}`
    await this._get(_id)

    const indexFound = this.items.findIndex((item) => item.id === _id)
    if (indexFound >= 0) {
      this.items.splice(indexFound, 1)
    }
  }

  protected async _get(id: string): Promise<E> {
    const item = this.items.find((item) => item.id === id)
    if (!item) {
      throw new NotFoundError(`Entity with id ${id} does not exist`)
    }
    return item
  }
}
