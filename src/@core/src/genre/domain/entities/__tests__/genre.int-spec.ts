import { UniqueEntityId } from '../../../../@shared/domain'
import { GenreFakeBuilder } from '../genre-fake-builder'
import { GenreEntity } from '../genre.entity'
/* eslint-disable no-new */

describe('GenreEntity Integration Tests', () => {
  describe('create method', () => {
    it('should a invalid GenreEntity using name property', () => {
      expect(() =>
        GenreFakeBuilder.aGenre().withInvalidNameEmpty(null).build(),
      ).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(() =>
        GenreFakeBuilder.aGenre().withInvalidNameEmpty(undefined).build(),
      ).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })
      expect(() =>
        GenreFakeBuilder.aGenre().withInvalidNameEmpty('').build(),
      ).containsErrorMessages({
        name: ['name should not be empty'],
      })
      expect(() =>
        GenreFakeBuilder.aGenre().withInvalidNameNotAString().build(),
      ).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(
        // @ts-expect-error
        () => new GenreEntity({ name: 't'.repeat(256) }),
      ).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      })
    })

    it('should a invalid GenreEntity using isActive property', () => {
      expect(() =>
        GenreFakeBuilder.aGenre().withInvalidIsActiveNotABoolean().build(),
      ).containsErrorMessages({
        isActive: ['isActive must be a boolean value'],
      })
    })
    it('should a invalid genre using categoriesId property', () => {
      expect(
        () =>
          // @ts-expect-error
          new GenreEntity({ categoriesId: null } as any),
      ).containsErrorMessages({
        categoriesId: [
          'categoriesId should not be empty',
          'each value in categoriesId must be an instance of UniqueEntityId',
        ],
      })

      expect(
        () =>
          // @ts-expect-error
          new GenreEntity({ categoriesId: undefined } as any),
      ).containsErrorMessages({
        categoriesId: [
          'categoriesId should not be empty',
          'each value in categoriesId must be an instance of UniqueEntityId',
        ],
      })

      expect(
        () =>
          // @ts-expect-error
          new GenreEntity({ categoriesId: [] } as any),
      ).containsErrorMessages({
        categoriesId: ['categoriesId should not be empty'],
      })

      expect(
        () =>
          // @ts-expect-error
          new GenreEntity({ categoriesId: [1] } as any),
      ).containsErrorMessages({
        categoriesId: [
          'each value in categoriesId must be an instance of UniqueEntityId',
        ],
      })

      const categoryId = new UniqueEntityId()

      expect(
        () =>
          // @ts-expect-error

          new GenreEntity({ categoriesId: [categoryId, categoryId] } as any),
      ).containsErrorMessages({
        categoriesId: ['categoriesId must not contains duplicate values'],
      })

      expect(
        () =>
          // @ts-expect-error

          new GenreEntity({
            categoriesId: new Map([
              [1, categoryId],
              [2, categoryId],
            ]),
          } as any),
      ).containsErrorMessages({
        categoriesId: ['categoriesId must not contains duplicate values'],
      })
    })

    it('should a valid genre', () => {
      expect.assertions(0)

      const categoryId1 = new UniqueEntityId()
      // @ts-expect-error

      new GenreEntity({
        name: 'test',
        categoriesId: new Map([[categoryId1.value, categoryId1]]),
      })
      // @ts-expect-error

      new GenreEntity({
        name: 'test',
        is_active: true,
        categoriesId: new Map([[categoryId1.value, categoryId1]]),
      })

      const categoryId2 = new UniqueEntityId()
      // @ts-expect-error
      new GenreEntity({
        name: 'test',
        is_active: false,
        categoriesId: new Map([
          [categoryId1.value, categoryId1],
          [categoryId2.value, categoryId2],
        ]),
      })
    })
  })
})

describe('update method', () => {
  it('should a invalid genre using name property', () => {
    const genre = GenreFakeBuilder.aGenre().build()
    expect(() => genre.update({ name: null })).containsErrorMessages({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
    })

    expect(() => genre.update({ name: '' })).containsErrorMessages({
      name: ['name should not be empty'],
    })

    expect(() => genre.update({ name: 5 as any })).containsErrorMessages({
      name: [
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
    })

    expect(() => genre.update({ name: 't'.repeat(256) })).containsErrorMessages(
      {
        name: ['name must be shorter than or equal to 255 characters'],
      },
    )
  })

  it('should a valid genre', () => {
    expect.assertions(0)
    const genre = GenreFakeBuilder.aGenre().build()
    genre.update({ name: 'name changed' })
  })
})

describe('addCategoryId method', () => {
  it('should throw an error when category id is invalid', () => {
    const genre = GenreFakeBuilder.aGenre().build()
    expect(() => genre.addCategoryId('fake' as any)).containsErrorMessages({
      categoriesId: [
        'each value in categoriesId must be an instance of UniqueEntityId',
      ],
    })
    console.log(genre.categoriesId)
    expect(genre.categoriesId.size).toBe(2)
  })

  it('should not add a duplicate category id', () => {
    const categoryId = new UniqueEntityId()
    const genre = GenreFakeBuilder.aGenre().withCategoryId(categoryId).build()
    genre.addCategoryId(categoryId)
    expect(genre.categoriesId.size).toBe(1)
  })

  it('should add a category id', () => {
    const genre = GenreFakeBuilder.aGenre().build()
    const categoryId = new UniqueEntityId()
    genre.addCategoryId(categoryId)
    expect(genre.categoriesId.size).toBe(3)
    expect(genre.categoriesId.get(categoryId.value)).toEqual(categoryId)
  })
})

describe('removeCategoryId method', () => {
  it('should throw an error when categoriesId has just one id', () => {
    const categoryId = new UniqueEntityId()
    const genre = GenreFakeBuilder.aGenre().withCategoryId(categoryId).build()
    expect(() => genre.removeCategoryId(categoryId)).containsErrorMessages({
      categoriesId: ['categoriesId should not be empty'],
    })
    expect(genre.categoriesId.size).toBe(1)
  })

  it('should discard removal attempt when category id does not exist', () => {
    const genre = GenreFakeBuilder.aGenre().build()
    const otherCategoryId = new UniqueEntityId()
    genre.removeCategoryId(otherCategoryId)
    expect(genre.categoriesId.size).toBe(2)
  })
})

describe('updateCategoriesId method', () => {
  it('should discard update when argument is not an array', () => {
    const categoryId = new UniqueEntityId()
    const genre = GenreFakeBuilder.aGenre().withCategoryId(categoryId).build()
    genre.updateCategoriesId('fake id' as any)
    expect(genre.categoriesId.size).toBe(1)
    expect(genre.categoriesId.get(categoryId.value)).toEqual(categoryId)
  })

  it('should discard update when argument is an empty array', () => {
    const categoryId = new UniqueEntityId()
    const genre = GenreFakeBuilder.aGenre().withCategoryId(categoryId).build()
    genre.updateCategoriesId([])
    expect(genre.categoriesId.size).toBe(1)
    expect(genre.categoriesId.get(categoryId.value)).toEqual(categoryId)
  })

  it('should throw an error when argument is an invalid category id', () => {
    const categoryId = new UniqueEntityId()
    const genre = GenreFakeBuilder.aGenre().withCategoryId(categoryId).build()
    expect(() =>
      genre.updateCategoriesId(['fake'] as any),
    ).containsErrorMessages({
      categoriesId: [
        'each value in categoriesId must be an instance of UniqueEntityId',
      ],
    })
    expect(genre.categoriesId.size).toBe(1)
    expect(genre.categoriesId.get(categoryId.value)).toEqual(categoryId)
  })

  it('should update categories id', () => {
    const categoryId = new UniqueEntityId()
    const categoriesId = [new UniqueEntityId(), new UniqueEntityId()]
    const genre = GenreFakeBuilder.aGenre().withCategoryId(categoryId).build()
    genre.updateCategoriesId(categoriesId)
    expect(genre.categoriesId.size).toBe(2)
    expect(genre.categoriesId.get(categoryId.value)).toBeUndefined()
    expect(genre.categoriesId.get(categoriesId[0].value)).toEqual(
      categoriesId[0],
    )
    expect(genre.categoriesId.get(categoriesId[1].value)).toEqual(
      categoriesId[1],
    )
  })

  it('should discard duplicated categories id on updating', () => {
    const categoryId = new UniqueEntityId()
    const categoriesId = [categoryId, categoryId, categoryId]
    const genre = GenreFakeBuilder.aGenre().withCategoryId(categoryId).build()
    genre.updateCategoriesId(categoriesId)
    expect(genre.categoriesId.size).toBe(1)
    expect(genre.categoriesId.get(categoryId.value)).toEqual(categoryId)
  })
})
