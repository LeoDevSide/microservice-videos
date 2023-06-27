import { ClassValidatorFields } from './class-validator-fields'
import * as libClassValidator from 'class-validator'
class StubClassValidatorFields extends ClassValidatorFields<{
  exampleField: string
}> {}
describe('ClassValidatorFields Unit Tests', () => {
  it('should initialize errors and validatedData variables with null', () => {
    const validator = new StubClassValidatorFields()

    expect(validator.errors).toBeNull()
    expect(validator.validatedData).toBeNull()
  })
  it('should validate with errors', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync')
    spyValidateSync.mockReturnValue([
      { property: 'exampleField', constraints: { isRequired: 'some error' } },
    ])

    const validator = new StubClassValidatorFields()
    expect(validator.validate(null)).toBeFalsy()

    expect(spyValidateSync).toHaveBeenCalled()
    expect(validator.validatedData).toBeNull()
    expect(validator.errors).toStrictEqual({ exampleField: ['some error'] })
  })

  it('should validate without errors', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync')
    spyValidateSync.mockReturnValue([])

    const validator = new StubClassValidatorFields()

    expect(validator.validate({ exampleField: 'some value' })).toBeTruthy()

    expect(spyValidateSync).toHaveBeenCalled()
    expect(validator.validatedData).toStrictEqual({
      exampleField: 'some value',
    })
    expect(validator.errors).toBeNull()
  })
})
