import { UniqueEntityId } from '../../../../@shared/domain'
import { CastMemberFakeBuilder } from '../cast-member-fake.builder'
import { CastMemberType } from '../cast-member.entity'

describe('CastMemberFakerBuilder Unit Tests', () => {
  describe('uniqueEntityId prop', () => {
    const faker = CastMemberFakeBuilder.aCastMember()

    it('should throw error when any with methods has called', () => {
      expect(() => faker['getValue']('uniqueEntityId')).toThrow(
        new Error(
          "Property uniqueEntityId not have a factory, use 'with' methods",
        ),
      )
    })

    it('should be undefined', () => {
      expect(faker['_uniqueEntityId']).toBeUndefined()
    })

    test('withEntityId', () => {
      const castMemberId = new UniqueEntityId()
      const $this = faker.withEntityId(castMemberId)
      expect($this).toBeInstanceOf(CastMemberFakeBuilder)
      expect(faker['_uniqueEntityId']).toBe(castMemberId)

      faker.withEntityId(() => castMemberId)
      expect(faker['_uniqueEntityId']()).toBe(castMemberId)

      expect(faker.uniqueEntityId).toBe(castMemberId)
    })

    it('should pass index to uniqueEntityId factory', () => {
      let mockFactory = jest.fn().mockReturnValue(new UniqueEntityId())
      faker.withEntityId(mockFactory)
      faker.build()
      expect(mockFactory).toHaveBeenCalledWith(0)

      mockFactory = jest.fn().mockReturnValue(new UniqueEntityId())
      const fakerMany = CastMemberFakeBuilder.theCategories(2)
      fakerMany.withEntityId(mockFactory)
      fakerMany.build()

      expect(mockFactory).toHaveBeenCalledWith(0)
      expect(mockFactory).toHaveBeenCalledWith(1)
    })
  })

  describe('name prop', () => {
    const faker = CastMemberFakeBuilder.aCastMember()
    it('should be a function', () => {
      expect(typeof faker['_name'] === 'function').toBeTruthy()
    })

    test('withName', () => {
      const $this = faker.withName('test name')
      expect($this).toBeInstanceOf(CastMemberFakeBuilder)
      expect(faker['_name']).toBe('test name')

      faker.withName(() => 'test name')
      // @ts-expect-error name is callable
      expect(faker['_name']()).toBe('test name')

      expect(faker.name).toBe('test name')
    })

    it('should pass index to name factory', () => {
      faker.withName((index) => `test name ${index}`)
      const castMember = faker.build()
      expect(castMember.name).toBe(`test name 0`)

      const fakerMany = CastMemberFakeBuilder.theCategories(2)
      fakerMany.withName((index) => `test name ${index}`)
      const categories = fakerMany.build()

      expect(categories[0].name).toBe(`test name 0`)
      expect(categories[1].name).toBe(`test name 1`)
    })

    test('invalid empty case', () => {
      const $this = faker.withInvalidNameEmpty(undefined)
      expect($this).toBeInstanceOf(CastMemberFakeBuilder)
      expect(faker['_name']).toBeUndefined()

      faker.withInvalidNameEmpty(null)
      expect(faker['_name']).toBeNull()

      faker.withInvalidNameEmpty('')
      expect(faker['_name']).toBe('')
    })

    test('invalid too long case', () => {
      const $this = faker.withInvalidNameTooLong()
      expect($this).toBeInstanceOf(CastMemberFakeBuilder)
      expect(faker['_name'].length).toBe(256)

      const tooLong = 'a'.repeat(256)
      faker.withInvalidNameTooLong(tooLong)
      expect(faker['_name'].length).toBe(256)
      expect(faker['_name']).toBe(tooLong)
    })
  })

  describe('type prop', () => {
    const faker = CastMemberFakeBuilder.aCastMember()
    it('should be a function', () => {
      expect(typeof faker['_type'] === 'function').toBeTruthy()
    })

    test('withType', () => {
      const $this = faker.withType(CastMemberType.ACTOR)
      expect($this).toBeInstanceOf(CastMemberFakeBuilder)
      expect(faker['_type']).toBe(CastMemberType.ACTOR)

      faker.withType(() => CastMemberType.ACTOR)
      // @ts-expect-error type is callable
      expect(faker['_type']()).toBe(CastMemberType.ACTOR)

      expect(faker.type).toBe(CastMemberType.ACTOR)
    })
  })

  describe('createdAt prop', () => {
    const faker = CastMemberFakeBuilder.aCastMember()

    it('should throw error when any with methods has called', () => {
      const fakerCastMember = CastMemberFakeBuilder.aCastMember()
      expect(() => fakerCastMember.createdAt).toThrow(
        new Error("Property createdAt not have a factory, use 'with' methods"),
      )
    })

    it('should be undefined', () => {
      expect(faker['_createdAt']).toBeUndefined()
    })

    test('withCreatedAt', () => {
      const date = new Date()
      const $this = faker.withCreatedAt(date)
      expect($this).toBeInstanceOf(CastMemberFakeBuilder)
      expect(faker['_createdAt']).toBe(date)

      faker.withCreatedAt(() => date)
      expect(faker['_createdAt']()).toBe(date)
      expect(faker.createdAt).toBe(date)
    })

    it('should pass index to createdAt factory', () => {
      const date = new Date()
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2))
      const castMember = faker.build()
      expect(castMember.createdAt.getTime()).toBe(date.getTime() + 2)

      const fakerMany = CastMemberFakeBuilder.theCategories(2)
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2))
      const categories = fakerMany.build()

      expect(categories[0].createdAt.getTime()).toBe(date.getTime() + 0 + 2)
      expect(categories[1].createdAt.getTime()).toBe(date.getTime() + 1 + 2)
    })
  })

  it('should create a castMember', () => {
    const faker = CastMemberFakeBuilder.aCastMember()
    let castMember = faker.build()

    expect(castMember.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    expect(typeof castMember.name === 'string').toBeTruthy()
    expect(castMember.type).toBeDefined()
    expect(castMember.createdAt).toBeInstanceOf(Date)

    const createdAt = new Date()
    const castMemberId = new UniqueEntityId()
    castMember = faker
      .withEntityId(castMemberId)
      .withName('name test')
      .withType(1)
      .withCreatedAt(createdAt)
      .build()

    expect(castMember.uniqueEntityId.value).toBe(castMemberId.value)
    expect(castMember.name).toBe('name test')
    expect(castMember.type).toBe(1)
    expect(castMember.props.createdAt).toEqual(createdAt)
  })

  it('should create many categories', () => {
    const faker = CastMemberFakeBuilder.theCategories(2)
    let categories = faker.build()

    categories.forEach((castMember) => {
      expect(castMember.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
      expect(typeof castMember.name === 'string').toBeTruthy()
      expect(typeof castMember.type === 'number').toBeTruthy()
      expect(castMember.createdAt).toBeInstanceOf(Date)
    })

    const createdAt = new Date()
    const castMemberId = new UniqueEntityId()
    categories = faker
      .withEntityId(castMemberId)
      .withName('name test')
      .withType(2)
      .withCreatedAt(createdAt)
      .build()

    categories.forEach((castMember) => {
      expect(castMember.uniqueEntityId.value).toBe(castMemberId.value)
      expect(castMember.name).toBe('name test')
      expect(castMember.type).toBe(2)
      expect(castMember.props.createdAt).toEqual(createdAt)
    })
  })
})
