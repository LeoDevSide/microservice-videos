import { Entity } from '../entity/entity'
import { NotFoundError } from '../errors/not-found.error'
import { UniqueEntityId } from '../value-objects/id.value-object'
import InMemoryRepository from './in-memory.repository'

type StubEntityProps = {
  name: string
  price: number
}

class StubEntity extends Entity<StubEntityProps> {}
class StubRepository extends InMemoryRepository<StubEntity> {}
describe('InMemoryRepository Unit Tests', () => {
  let repository: StubRepository
  beforeEach(() => {
    repository = new StubRepository()
  })
  it('should inserts a new entity', () => {
    const entity = new StubEntity({
      name: 'test',
      price: 100,
    })
    repository.insert(entity)
    expect(repository.items).toHaveLength(1)
    expect(repository.items[0].props.name).toBe('test')
    expect(repository.items[0].props.price).toBe(100)
  })
  it('should updates an existing entity', async () => {
    const entity = new StubEntity({
      name: 'test',
      price: 100,
    })
    await repository.insert(entity)
    expect(repository.items).toHaveLength(1)

    entity.props.name = 'test2'
    entity.props.price = 120

    await repository.update(entity)
    expect(repository.items).toHaveLength(1)
    expect(repository.items[0].props.name).toBe('test2')
    expect(repository.items[0].props.price).toBe(120)
  })
  it('should deletes an existing entity', async () => {
    const entity = new StubEntity({
      name: 'test',
      price: 100,
    })

    await repository.insert(entity)
    expect(repository.items).toHaveLength(1)

    await repository.delete(entity.id)
    expect(repository.items).toHaveLength(0)
  })

  it('should returns all entities', async () => {
    const entity = new StubEntity({
      name: 'test',
      price: 100,
    })
    const entity2 = new StubEntity({
      name: 'test2',
      price: 200,
    })

    await repository.insert(entity)
    await repository.insert(entity2)
    expect(repository.items).toHaveLength(2)

    const entities = await repository.findAll()
    expect(entities).toHaveLength(2)
  })
  it('should returns an entity by id', async () => {
    const entity = new StubEntity({
      name: 'test',
      price: 100,
    })
    const entity2 = new StubEntity({
      name: 'test2',
      price: 200,
    })

    await repository.insert(entity)
    await repository.insert(entity2)
    expect(repository.items).toHaveLength(2)

    const entityById = await repository.findById(entity.id)
    expect(entityById).toEqual(entity)
    const entityById2 = await repository.findById(entity2.id)
    expect(entityById2).toEqual(entity2)
  })

  it('should throw an error when entity is not found', async () => {
    expect(
      async () => await repository.findById('non-existent'),
    ).rejects.toBeInstanceOf(NotFoundError)
    expect(
      async () => await repository.findById(new UniqueEntityId()),
    ).rejects.toBeInstanceOf(NotFoundError)

    expect(
      async () => await repository.delete('non-existent'),
    ).rejects.toBeInstanceOf(NotFoundError)
    expect(
      async () => await repository.delete(new UniqueEntityId()),
    ).rejects.toBeInstanceOf(NotFoundError)

    const nonExistentEntity = new StubEntity({ name: 'non-existent', price: 1 })
    expect(
      async () => await repository.update(nonExistentEntity),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})
