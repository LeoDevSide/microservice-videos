import { UniqueEntityId } from '../../../../@shared/domain'
import { CategoryFakeBuilder } from '../category-fake.builder'

describe('CategoryFakerBuilder Unit Tests', () => {
  describe('uniqueEntityId prop', () => {
    const faker = CategoryFakeBuilder.aCategory()

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
      const categoryId = new UniqueEntityId()
      const $this = faker.withEntityId(categoryId)
      expect($this).toBeInstanceOf(CategoryFakeBuilder)
      expect(faker['_uniqueEntityId']).toBe(categoryId)

      faker.withEntityId(() => categoryId)
      expect(faker['_uniqueEntityId']()).toBe(categoryId)

      expect(faker.uniqueEntityId).toBe(categoryId)
    })

    it('should pass index to uniqueEntityId factory', () => {
      let mockFactory = jest.fn().mockReturnValue(new UniqueEntityId())
      faker.withEntityId(mockFactory)
      faker.build()
      expect(mockFactory).toHaveBeenCalledWith(0)

      mockFactory = jest.fn().mockReturnValue(new UniqueEntityId())
      const fakerMany = CategoryFakeBuilder.theCategories(2)
      fakerMany.withEntityId(mockFactory)
      fakerMany.build()

      expect(mockFactory).toHaveBeenCalledWith(0)
      expect(mockFactory).toHaveBeenCalledWith(1)
    })
  })

  describe('name prop', () => {
    const faker = CategoryFakeBuilder.aCategory()
    it('should be a function', () => {
      expect(typeof faker['_name'] === 'function').toBeTruthy()
    })

    test('withName', () => {
      const $this = faker.withName('test name')
      expect($this).toBeInstanceOf(CategoryFakeBuilder)
      expect(faker['_name']).toBe('test name')

      faker.withName(() => 'test name')
      // @ts-expect-error name is callable
      expect(faker['_name']()).toBe('test name')

      expect(faker.name).toBe('test name')
    })

    it('should pass index to name factory', () => {
      faker.withName((index) => `test name ${index}`)
      const category = faker.build()
      expect(category.name).toBe(`test name 0`)

      const fakerMany = CategoryFakeBuilder.theCategories(2)
      fakerMany.withName((index) => `test name ${index}`)
      const categories = fakerMany.build()

      expect(categories[0].name).toBe(`test name 0`)
      expect(categories[1].name).toBe(`test name 1`)
    })

    test('invalid empty case', () => {
      const $this = faker.withInvalidNameEmpty(undefined)
      expect($this).toBeInstanceOf(CategoryFakeBuilder)
      expect(faker['_name']).toBeUndefined()

      faker.withInvalidNameEmpty(null)
      expect(faker['_name']).toBeNull()

      faker.withInvalidNameEmpty('')
      expect(faker['_name']).toBe('')
    })

    test('invalid too long case', () => {
      const $this = faker.withInvalidNameTooLong()
      expect($this).toBeInstanceOf(CategoryFakeBuilder)
      expect(faker['_name'].length).toBe(256)

      const tooLong = 'a'.repeat(256)
      faker.withInvalidNameTooLong(tooLong)
      expect(faker['_name'].length).toBe(256)
      expect(faker['_name']).toBe(tooLong)
    })
  })

  describe('description prop', () => {
    const faker = CategoryFakeBuilder.aCategory()
    it('should be a function', () => {
      expect(typeof faker['_description'] === 'function').toBeTruthy()
    })

    test('withDescription', () => {
      const $this = faker.withDescription('test description')
      expect($this).toBeInstanceOf(CategoryFakeBuilder)
      expect(faker['_description']).toBe('test description')

      faker.withDescription(() => 'test description')
      // @ts-expect-error description is callable
      expect(faker['_description']()).toBe('test description')

      expect(faker.description).toBe('test description')
    })

    it('should pass index to description factory', () => {
      faker.withDescription((index) => `test description ${index}`)
      const category = faker.build()
      expect(category.description).toBe(`test description 0`)

      const fakerMany = CategoryFakeBuilder.theCategories(2)
      fakerMany.withDescription((index) => `test description ${index}`)
      const categories = fakerMany.build()

      expect(categories[0].description).toBe(`test description 0`)
      expect(categories[1].description).toBe(`test description 1`)
    })
  })

  describe('isActive prop', () => {
    const faker = CategoryFakeBuilder.aCategory()
    it('should be a function', () => {
      expect(typeof faker['_isActive'] === 'function').toBeTruthy()
    })

    test('activate', () => {
      const $this = faker.activate()
      expect($this).toBeInstanceOf(CategoryFakeBuilder)
      expect(faker['_isActive']).toBeTruthy()
      expect(faker.isActive).toBeTruthy()
    })

    test('deactivate', () => {
      const $this = faker.deactivate()
      expect($this).toBeInstanceOf(CategoryFakeBuilder)
      expect(faker['_isActive']).toBeFalsy()
      expect(faker.isActive).toBeFalsy()
    })
  })

  describe('createdAt prop', () => {
    const faker = CategoryFakeBuilder.aCategory()

    it('should throw error when any with methods has called', () => {
      const fakerCategory = CategoryFakeBuilder.aCategory()
      expect(() => fakerCategory.createdAt).toThrow(
        new Error("Property createdAt not have a factory, use 'with' methods"),
      )
    })

    it('should be undefined', () => {
      expect(faker['_createdAt']).toBeUndefined()
    })

    test('withCreatedAt', () => {
      const date = new Date()
      const $this = faker.withCreatedAt(date)
      expect($this).toBeInstanceOf(CategoryFakeBuilder)
      expect(faker['_createdAt']).toBe(date)

      faker.withCreatedAt(() => date)
      expect(faker['_createdAt']()).toBe(date)
      expect(faker.createdAt).toBe(date)
    })

    it('should pass index to createdAt factory', () => {
      const date = new Date()
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2))
      const category = faker.build()
      expect(category.createdAt.getTime()).toBe(date.getTime() + 2)

      const fakerMany = CategoryFakeBuilder.theCategories(2)
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2))
      const categories = fakerMany.build()

      expect(categories[0].createdAt.getTime()).toBe(date.getTime() + 0 + 2)
      expect(categories[1].createdAt.getTime()).toBe(date.getTime() + 1 + 2)
    })
  })

  it('should create a category', () => {
    const faker = CategoryFakeBuilder.aCategory()
    let category = faker.build()

    expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    expect(typeof category.name === 'string').toBeTruthy()
    expect(typeof category.description === 'string').toBeTruthy()
    expect(category.isActive).toBeTruthy()
    expect(category.createdAt).toBeInstanceOf(Date)

    const createdAt = new Date()
    const categoryId = new UniqueEntityId()
    category = faker
      .withEntityId(categoryId)
      .withName('name test')
      .withDescription('description test')
      .deactivate()
      .withCreatedAt(createdAt)
      .build()

    expect(category.uniqueEntityId.value).toBe(categoryId.value)
    expect(category.name).toBe('name test')
    expect(category.description).toBe('description test')
    expect(category.isActive).toBeFalsy()
    expect(category.props.createdAt).toEqual(createdAt)
  })

  it('should create many categories', () => {
    const faker = CategoryFakeBuilder.theCategories(2)
    let categories = faker.build()

    categories.forEach((category) => {
      expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
      expect(typeof category.name === 'string').toBeTruthy()
      expect(typeof category.description === 'string').toBeTruthy()
      expect(category.isActive).toBeTruthy()
      expect(category.createdAt).toBeInstanceOf(Date)
    })

    const createdAt = new Date()
    const categoryId = new UniqueEntityId()
    categories = faker
      .withEntityId(categoryId)
      .withName('name test')
      .withDescription('description test')
      .deactivate()
      .withCreatedAt(createdAt)
      .build()

    categories.forEach((category) => {
      expect(category.uniqueEntityId.value).toBe(categoryId.value)
      expect(category.name).toBe('name test')
      expect(category.description).toBe('description test')
      expect(category.isActive).toBeFalsy()
      expect(category.props.createdAt).toEqual(createdAt)
    })
  })
})
