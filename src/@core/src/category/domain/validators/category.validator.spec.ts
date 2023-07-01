import { CategoryProps } from '../entities/category.entity'
import CategoryValidatorFactory, {
  CategoryRules,
  CategoryValidator,
} from './category.validator'
describe('CategoryValidator Tests', () => {
  let validator: CategoryValidator

  beforeEach(() => (validator = CategoryValidatorFactory.create()))

  test('invalidation cases for name field', () => {
    expect({ validator, data: null }).containsErrorMessages({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
    })

    expect({ validator, data: { name: null } }).containsErrorMessages({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
    })

    expect({ validator, data: { name: '' } }).containsErrorMessages({
      name: ['name should not be empty'],
    })

    expect({ validator, data: { name: 5 as any } }).containsErrorMessages({
      name: [
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
    })

    expect({
      validator,
      data: { name: 't'.repeat(256) },
    }).containsErrorMessages({
      name: ['name must be shorter than or equal to 255 characters'],
    })
  })

  test('invalidation cases for description field', () => {
    expect({ validator, data: { description: 5 } }).containsErrorMessages({
      description: ['description must be a string'],
    })
  })

  test('invalidation cases for isActive field', () => {
    expect({ validator, data: { isActive: 5 } }).containsErrorMessages({
      isActive: ['isActive must be a boolean value'],
    })

    expect({ validator, data: { isActive: 0 } }).containsErrorMessages({
      isActive: ['isActive must be a boolean value'],
    })

    expect({ validator, data: { isActive: 1 } }).containsErrorMessages({
      isActive: ['isActive must be a boolean value'],
    })
  })

  test('valid cases for fields', () => {
    const arrange: CategoryProps[] = [
      { name: 'some value' },
      {
        name: 'some value',
        description: undefined,
      },
      { name: 'some value', description: null },
      { name: 'some value', isActive: true },
      { name: 'some value', isActive: false },
    ]

    arrange.forEach((item) => {
      const isValid = validator.validate(item)
      expect(isValid).toBeTruthy()
      expect(validator.validatedData).toStrictEqual(new CategoryRules(item))
    })
  })
})
