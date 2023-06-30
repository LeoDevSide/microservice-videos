import { UniqueEntityId } from '../value-objects/id.value-object'
import { Entity } from './entity'

class StubEntity extends Entity<{ prop1: string; prop2: number }> {}
describe('Generic Entity Unit Tests', () => {
  it('should set props and id', () => {
    const arrange = { prop1: 'prop1 value', prop2: 10 }
    const entity = new StubEntity(arrange)
    expect(entity.props).toStrictEqual(arrange)
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    expect(entity.id).toBeTruthy()
  })
  it('should accept an optional existent id in constructor', () => {
    const arrange = { prop1: 'prop1 value', prop2: 10 }
    const existentId = new UniqueEntityId('random-id')
    const entity = new StubEntity(arrange, existentId)
    expect(entity.props).toStrictEqual(arrange)
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    expect(entity.id).toEqual(existentId.value)
  })
  // it('should convert a entity to a JSON', () => {
  //   const arrange = { prop1: 'prop1 value', prop2: 10 }
  //   const existentId = new UniqueEntityId('random-id')
  //   const entity = new StubEntity(arrange, existentId)
  //   const json = entity.toJSON()
  //   expect(json).toStrictEqual({
  //     id: entity.id,
  //     ...arrange,
  //   })
  //   expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
  //   expect(entity.id).toEqual(existentId.value)
  // })
})
