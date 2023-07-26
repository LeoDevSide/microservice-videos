import { CastMemberProps, CastMemberType } from '../entities/cast-member.entity'
import {
  CastMemberValidatorFactory,
  CastMemberRules,
  CastMemberValidator,
} from './cast-member.validator'
describe('CastMemberValidator Tests', () => {
  let validator: CastMemberValidator

  beforeEach(() => (validator = CastMemberValidatorFactory.create()))

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

  test('invalidation cases for type field', () => {
    expect({ validator, data: null }).containsErrorMessages({
      type: [
        'type should not be empty',
        'type must be one of the following values: 1, 2',
      ],
    })

    expect({ validator, data: { type: null } }).containsErrorMessages({
      type: [
        'type should not be empty',
        'type must be one of the following values: 1, 2',
      ],
    })

    expect({ validator, data: { type: '' } }).containsErrorMessages({
      type: [
        'type should not be empty',
        'type must be one of the following values: 1, 2',
      ],
    })

    expect({ validator, data: { type: 5 as any } }).containsErrorMessages({
      type: ['type must be one of the following values: 1, 2'],
    })
  })

  test('valid cases for fields', () => {
    const arrange: CastMemberProps[] = [
      { name: 'some value', type: 1 },
      { name: 'some value', type: 2 },
      {
        name: 'some value',
        type: CastMemberType.ACTOR,
      },
      {
        name: 'some value',
        type: CastMemberType.DIRECTOR,
      },
    ]

    arrange.forEach((item) => {
      const isValid = validator.validate(item)
      expect(isValid).toBeTruthy()
      expect(validator.validatedData).toStrictEqual(new CastMemberRules(item))
    })
  })
})
