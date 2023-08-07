import { UniqueEntityId } from '../../../../@shared/domain'
import { GenreFakeBuilder } from '../genre-fake-builder'

describe('GenreFakerBuilder Unit Tests', () => {
  describe('entity_id prop', () => {
    const faker = GenreFakeBuilder.aGenre()

    it('should be undefined', () => {
      expect(faker['_uniqueEntityId']).toBeUndefined()
    })

    test('withEntityId', () => {
      const genreId = new UniqueEntityId()
      const $this = faker.withEntityId(genreId)
      expect($this).toBeInstanceOf(GenreFakeBuilder)
      expect(faker['_uniqueEntityId']).toBe(genreId)

      faker.withEntityId(() => genreId)
      expect(faker['_uniqueEntityId']()).toBe(genreId)

      expect(faker.uniqueEntityId).toBe(genreId)
    })

    it('should pass index to unique_entity_id factory', () => {
      let mockFactory = jest.fn().mockReturnValue(new UniqueEntityId())
      faker.withEntityId(mockFactory)
      faker.build()
      expect(mockFactory).toHaveBeenCalledWith(0)

      mockFactory = jest.fn().mockReturnValue(new UniqueEntityId())
      const fakerMany = GenreFakeBuilder.theGenres(2)
      fakerMany.withEntityId(mockFactory)
      fakerMany.build()

      expect(mockFactory).toHaveBeenCalledWith(0)
      expect(mockFactory).toHaveBeenCalledWith(1)
    })
  })

  describe('name prop', () => {
    const faker = GenreFakeBuilder.aGenre()
    it('should be a function', () => {
      expect(typeof faker['_name'] === 'function').toBeTruthy()
    })

    test('withName', () => {
      const $this = faker.withName('test name')
      expect($this).toBeInstanceOf(GenreFakeBuilder)
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

      const fakerMany = GenreFakeBuilder.theGenres(2)
      fakerMany.withName((index) => `test name ${index}`)
      const categories = fakerMany.build()

      expect(categories[0].name).toBe(`test name 0`)
      expect(categories[1].name).toBe(`test name 1`)
    })

    test('invalid empty case', () => {
      const $this = faker.withInvalidNameEmpty(undefined)
      expect($this).toBeInstanceOf(GenreFakeBuilder)
      expect(faker['_name']).toBeUndefined()

      faker.withInvalidNameEmpty(null)
      expect(faker['_name']).toBeNull()

      faker.withInvalidNameEmpty('')
      expect(faker['_name']).toBe('')
    })

    test('invalid too long case', () => {
      const $this = faker.withInvalidNameTooLong()
      expect($this).toBeInstanceOf(GenreFakeBuilder)
      expect(faker['_name'].length).toBe(256)

      const tooLong = 'a'.repeat(256)
      faker.withInvalidNameTooLong(tooLong)
      expect(faker['_name'].length).toBe(256)
      expect(faker['_name']).toBe(tooLong)
    })
  })

  describe('categoriesId prop', () => {
    const faker = GenreFakeBuilder.aGenre()
    it('should be an array', () => {
      expect(faker['_categoriesId']).toBeInstanceOf(Array)
    })

    it('should be empyt', () => {
      expect(faker['_categoriesId']).toHaveLength(0)
    })

    test('withCategoryId', () => {
      const categoryId1 = new UniqueEntityId()
      const $this = faker.withCategoryId(categoryId1)
      expect($this).toBeInstanceOf(GenreFakeBuilder)
      expect(faker['_categoriesId']).toStrictEqual([categoryId1])

      const categoryId2 = new UniqueEntityId()
      faker.withCategoryId(() => categoryId2)

      expect([
        faker['_categoriesId'][0],
        // @ts-expect-error _categoriesId is callable
        faker['_categoriesId'][1](),
      ]).toStrictEqual([categoryId1, categoryId2])
    })

    // it('should pass index to categoriesId factory', () => {
    //   const categoriesId = [new UniqueEntityId(), new UniqueEntityId()]
    //   faker.withCategoryId((index) => categoriesId[index])
    //   const genre = faker.build()
    //   expect(genre.categoriesId.get(categoriesId[0].value)).toBe(
    //     categoriesId[0],
    //   )

    //   const fakerMany = GenreFakeBuilder.theGenres(2)
    //   fakerMany.withCategoryId((index) => categoriesId[index])
    //   const genres = fakerMany.build()

    //   expect(genres[0].categoriesId.get(categoriesId[0].value)).toBe(
    //     categoriesId[0],
    //   )
    //   console.log(genres[1].categoriesId)
    //   expect(genres[1].categoriesId.get(categoriesId[1].value)).toBe(
    //     categoriesId[1],
    //   )
    // })
  })

  describe('isActive prop', () => {
    const faker = GenreFakeBuilder.aGenre()
    it('should be a function', () => {
      expect(typeof faker['_isActive'] === 'function').toBeTruthy()
    })

    test('activate', () => {
      const $this = faker.activate()
      expect($this).toBeInstanceOf(GenreFakeBuilder)
      expect(faker['_isActive']).toBeTruthy()
      expect(faker.isActive).toBeTruthy()
    })

    test('deactivate', () => {
      const $this = faker.deactivate()
      expect($this).toBeInstanceOf(GenreFakeBuilder)
      expect(faker['_isActive']).toBeFalsy()
      expect(faker.isActive).toBeFalsy()
    })
  })

  describe('createdAt prop', () => {
    const faker = GenreFakeBuilder.aGenre()

    it('should throw error when any with methods has called', () => {
      const fakerCategory = GenreFakeBuilder.aGenre()
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
      expect($this).toBeInstanceOf(GenreFakeBuilder)
      expect(faker['_createdAt']).toBe(date)

      faker.withCreatedAt(() => date)
      expect(faker['_createdAt']()).toBe(date)
      expect(faker.createdAt).toBe(date)
    })

    it('should pass index to createdAt factory', () => {
      const date = new Date()
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2))
      const genre = faker.build()
      expect(genre.createdAt.getTime()).toBe(date.getTime() + 2)

      const fakerMany = GenreFakeBuilder.theGenres(2)
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2))
      const genres = fakerMany.build()

      expect(genres[0].createdAt.getTime()).toBe(date.getTime() + 0 + 2)
      expect(genres[1].createdAt.getTime()).toBe(date.getTime() + 1 + 2)
    })
  })

  it('should create a genre', () => {
    let faker = GenreFakeBuilder.aGenre()
    let genre = faker.build()

    expect(typeof genre.name === 'string').toBeTruthy()
    expect(genre.categoriesId).toBeInstanceOf(Map)
    expect(genre.categoriesId.size).toBe(2)
    expect(genre.categoriesId.values().next().value).toBeInstanceOf(
      UniqueEntityId,
    )
    expect(genre.isActive).toBeTruthy()
    expect(genre.createdAt).toBeInstanceOf(Date)

    const createdAt = new Date()
    const genreId = new UniqueEntityId()
    const categoryId1 = new UniqueEntityId()
    const categoryId2 = new UniqueEntityId()
    faker = GenreFakeBuilder.aGenre()
    genre = faker
      .withEntityId(genreId)
      .withName('name test')
      .withCategoryId(categoryId1)
      .withCategoryId(categoryId2)
      .deactivate()
      .withCreatedAt(createdAt)
      .build()

    expect(genre.id).toBe(genreId.value)
    expect(genre.name).toBe('name test')
    expect(genre.categoriesId.get(categoryId1.value)).toBe(categoryId1)
    expect(genre.categoriesId.get(categoryId2.value)).toBe(categoryId2)
    expect(genre.isActive).toBeFalsy()
    expect(genre.props.createdAt).toEqual(createdAt)
  })

  it('should create many genres', () => {
    const faker = GenreFakeBuilder.theGenres(2)
    let genres = faker.build()

    genres.forEach((genre) => {
      expect(genre.categoriesId).toBeInstanceOf(Map)
      expect(genre.categoriesId.size).toBe(2)
      expect(genre.categoriesId.values().next().value).toBeInstanceOf(
        UniqueEntityId,
      )
      expect(genre.isActive).toBeTruthy()
      expect(genre.createdAt).toBeInstanceOf(Date)
    })

    const createdAt = new Date()
    const genreId = new UniqueEntityId()
    const categoryId1 = new UniqueEntityId()
    const categoryId2 = new UniqueEntityId()
    genres = faker
      .withEntityId(genreId)
      .withName('name test')
      .withCategoryId(categoryId1)
      .withCategoryId(categoryId2)
      .deactivate()
      .withCreatedAt(createdAt)
      .build()

    genres.forEach((genre) => {
      expect(genre.id).toBe(genreId.value)
      expect(genre.name).toBe('name test')
      expect(genre.categoriesId).toBeInstanceOf(Map)
      expect(genre.categoriesId.get(categoryId1.value)).toBe(categoryId1)
      expect(genre.categoriesId.get(categoryId2.value)).toBe(categoryId2)
      expect(genre.isActive).toBeFalsy()
      expect(genre.props.createdAt).toEqual(createdAt)
    })
  })
})
