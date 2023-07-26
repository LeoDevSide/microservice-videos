/* eslint-disable no-new */
import { UniqueEntityId } from '../../../../@shared/domain'
import { CastMemberEntity, CastMemberType } from '../cast-member.entity'

describe('CastMember Entity Unit Test', () => {
  test('constructor of castMember', () => {
    const createdAt = new Date()
    const props = {
      name: 'test',
      type: 1,
      createdAt,
    }
    const castMemberWithAllFields = new CastMemberEntity(
      props,
      new UniqueEntityId('id-1'),
    )

    expect(castMemberWithAllFields.props).toEqual({
      name: 'test',
      type: 1,
      createdAt,
    })
    expect(castMemberWithAllFields.id).toEqual('id-1')

    const castMemberOptFields = new CastMemberEntity({
      name: 'test',
      type: CastMemberType.DIRECTOR,
    })
    expect(castMemberOptFields.createdAt).toBeTruthy()
    expect(castMemberOptFields.name).toBe('test')
    expect(castMemberOptFields.type).toBe(1)
    expect(castMemberOptFields.id).not.toBeNull()
    expect(castMemberOptFields.id).toBeTruthy()

    const castMemberWithNullId = new CastMemberEntity(
      { name: 'test', type: CastMemberType.DIRECTOR },
      null,
    )
    expect(castMemberWithNullId.createdAt).toBeTruthy()
    expect(castMemberWithNullId.type).toBe(1)
    expect(castMemberWithNullId.name).toBe('test')
    expect(castMemberWithNullId.id).not.toBeNull()
    expect(castMemberWithNullId.id).toBeTruthy()

    const castMemberWithUndefinedId = new CastMemberEntity(
      { name: 'test', type: CastMemberType.DIRECTOR },
      undefined,
    )
    expect(castMemberWithUndefinedId.createdAt).toBeTruthy()
    expect(castMemberWithUndefinedId.name).toBe('test')
    expect(castMemberWithNullId.type).toBe(1)
    expect(castMemberWithUndefinedId.id).not.toBeNull()
    expect(castMemberWithUndefinedId.id).toBeTruthy()
  })

  it('should be able to update a existent castMemberEntity object', () => {
    const createdAt = new Date()
    const castMemberEntity = new CastMemberEntity(
      {
        name: 'test',
        type: 1,
        createdAt,
      },
      new UniqueEntityId('id-1'),
    )

    castMemberEntity.update({
      name: 'new name value',
      type: 2,
    })

    expect(castMemberEntity.name).toEqual('new name value')
    expect(castMemberEntity.type).toEqual(2)
  })
  it('should be able to use enum type', () => {
    const createdAt = new Date()
    const castMemberEntity = new CastMemberEntity(
      {
        name: 'test',
        type: CastMemberType.ACTOR,
        createdAt,
      },
      new UniqueEntityId('id-1'),
    )

    expect(castMemberEntity.type).toEqual(2)
    expect(castMemberEntity.type).toEqual(CastMemberType.ACTOR)

    castMemberEntity.update({
      name: 'test2',
      type: CastMemberType.DIRECTOR,
    })
    expect(castMemberEntity.type).toEqual(1)
    expect(castMemberEntity.type).toEqual(CastMemberType.DIRECTOR)
  })
})

describe('CastMemberEntity Integration Tests', () => {
  describe('create method', () => {
    it('should a invalid CastMemberEntity using name property', () => {
      expect(
        () => new CastMemberEntity({ name: null, type: 1 }),
      ).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(
        () => new CastMemberEntity({ name: '', type: 1 }),
      ).containsErrorMessages({
        name: ['name should not be empty'],
      })

      expect(
        () => new CastMemberEntity({ name: 5 as any, type: 1 }),
      ).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(
        () => new CastMemberEntity({ name: 't'.repeat(256), type: 1 }),
      ).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      })
    })

    it('should a invalid CastMemberEntity using type property', () => {
      expect(
        () => new CastMemberEntity({ name: 'ok', type: 5 } as any),
      ).containsErrorMessages({
        type: ['type must be one of the following values: 1, 2'],
      })
      expect(
        () => new CastMemberEntity({ name: 'ok', type: '1' } as any),
      ).containsErrorMessages({
        type: ['type must be one of the following values: 1, 2'],
      })
      expect(
        () => new CastMemberEntity({ name: 'ok', type: null } as any),
      ).containsErrorMessages({
        type: [
          'type should not be empty',
          'type must be one of the following values: 1, 2',
        ],
      })
    })

    it('should a valid CastMemberEntity', () => {
      expect.assertions(0)

      new CastMemberEntity({ name: 'ok', type: 1 }) // NOSONAR
      new CastMemberEntity({ name: 'ok', type: CastMemberType.ACTOR }) // NOSONAR
      new CastMemberEntity({ name: 'ok', type: 2 }) // NOSONAR
      new CastMemberEntity({ name: 'ok', type: CastMemberType.DIRECTOR }) // NOSONAR
    })
  })

  describe('update method', () => {
    it('should a invalid CastMemberEntity using invalid name or type', () => {
      const castMember = new CastMemberEntity({ name: 'ok', type: 1 })
      expect(() =>
        castMember.update({ type: null, name: null }),
      ).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
        type: [
          'type should not be empty',
          'type must be one of the following values: 1, 2',
        ],
      })

      expect(() =>
        castMember.update({ name: '', type: 1 }),
      ).containsErrorMessages({
        name: ['name should not be empty'],
      })

      expect(() =>
        castMember.update({ name: 5 as any, type: 4 as any }),
      ).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
        type: ['type must be one of the following values: 1, 2'],
      })

      expect(() =>
        castMember.update({ name: 't'.repeat(256), type: 2 }),
      ).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      })
    })

    it('should a valid CastMemberEntity', () => {
      expect.assertions(0)
      const castMember = new CastMemberEntity({ name: 'ok', type: 2 })
      castMember.update({ name: 'name changed', type: 1 })
      castMember.update({
        name: 'name changed',
        type: 2,
      })
      castMember.update({
        name: 'name changed',
        type: CastMemberType.DIRECTOR,
      })
      castMember.update({
        name: 'name changed',
        type: CastMemberType.ACTOR,
      })
    })
  })
})
