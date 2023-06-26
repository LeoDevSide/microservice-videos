import { UniqueEntityId } from '../id.value-object'

describe('ID ValueObj Unit Test', () => {
  test('constructor of id value object with no props', () => {
    const id = new UniqueEntityId()
    expect(id).toBeInstanceOf(UniqueEntityId)
    expect(id.value).toBeTruthy()
    expect(id.value).not.toBeNull()
    expect(id.value).not.toBeUndefined()
  })
  test('constructor of id value object with existing id string', () => {
    const id = new UniqueEntityId('any-string')
    expect(id).toBeInstanceOf(UniqueEntityId)
    expect(id.value).toBeTruthy()
    expect(id.value).not.toBeNull()
    expect(id.value).not.toBeUndefined()
    expect(id.value).toBe('any-string')
  })
})
