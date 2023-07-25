/* eslint-disable no-new */

import { CategoryEntity } from '../category.entity'

describe('CategoryEntity Integration Tests', () => {
  describe('create method', () => {
    it('should a invalid CategoryEntity using name property', () => {
      expect(() => new CategoryEntity({ name: null })).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(() => new CategoryEntity({ name: '' })).containsErrorMessages({
        name: ['name should not be empty'],
      })

      expect(
        () => new CategoryEntity({ name: 5 as any }),
      ).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(
        () => new CategoryEntity({ name: 't'.repeat(256) }),
      ).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      })
    })

    it('should a invalid CategoryEntity using description property', () => {
      expect(
        () => new CategoryEntity({ description: 5 } as any),
      ).containsErrorMessages({
        description: ['description must be a string'],
      })
    })

    it('should a invalid CategoryEntity using isActive property', () => {
      expect(
        () => new CategoryEntity({ isActive: 5 } as any),
      ).containsErrorMessages({
        isActive: ['isActive must be a boolean value'],
      })
    })

    it('should a valid CategoryEntity', () => {
      expect.assertions(0)

      new CategoryEntity({ name: 'Movie' }) // NOSONAR
      new CategoryEntity({ name: 'Movie', description: 'some description' }) // NOSONAR
      new CategoryEntity({ name: 'Movie', description: null }) // NOSONAR

      new CategoryEntity({
        name: 'Movie',
        description: 'some description',
        isActive: false,
      })
      /* NOSONAR */ new CategoryEntity({
        name: 'Movie',
        description: 'some description',
        isActive: true,
      })
    })
  })

  describe('update method', () => {
    it('should a invalid CategoryEntity using name property', () => {
      const category = new CategoryEntity({ name: 'Movie' })
      expect(() =>
        category.update({ description: null, name: null }),
      ).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(() =>
        category.update({ name: '', description: null }),
      ).containsErrorMessages({
        name: ['name should not be empty'],
      })

      expect(() =>
        category.update({ name: 5 as any, description: null }),
      ).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(() =>
        category.update({ name: 't'.repeat(256), description: null }),
      ).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      })
    })

    it('should a invalid CategoryEntity using description property', () => {
      const category = new CategoryEntity({ name: 'Movie' })
      expect(() =>
        category.update({ name: null, description: 5 as any }),
      ).containsErrorMessages({
        description: ['description must be a string'],
      })
    })

    it('should a valid CategoryEntity', () => {
      expect.assertions(0)
      const category = new CategoryEntity({ name: 'Movie' })
      category.update({ name: 'name changed', description: null })
      category.update({ name: 'name changed', description: 'some description' })
    })
  })
})
