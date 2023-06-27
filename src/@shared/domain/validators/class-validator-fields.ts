import { ValidationError, validateSync } from 'class-validator'
import IValidatorFields, { FieldsErrors } from './validators-fields.interface'

export abstract class ClassValidatorFields<PropsValidated>
  implements IValidatorFields<PropsValidated>
{
  errors: FieldsErrors = null
  validatedData: PropsValidated = null
  validate(data: any): boolean {
    const errors: ValidationError[] = validateSync(data)
    if (errors.length > 0) {
      this.errors = {}
      for (const error of errors) {
        const field = error.property
        this.errors[field] = Object.values(error.constraints)
      }
    } else {
      this.validatedData = data
    }
    return !errors.length
  }
}
